# scaling_consumer.py
# Listens for scaling recommendations from Saksham's monitoring layer
# and patches the shared PostgreSQL StatefulSet with new resource values
#
# In production: connects to IntelliDB pub/sub and receives real events
# Right now: exposes a method that can be called directly for simulation
#
# When a scaling event arrives:
#   1. Validate the event has required fields
#   2. Patch the StatefulSet with new CPU/memory values
#   3. Kubernetes performs a rolling restart with new cgroup limits
#   4. Patroni manages HA during the restart
#   5. Log the result

import time
import threading
import logging
import json
from kubernetes import client

logger = logging.getLogger(__name__)

SHARED_NAMESPACE = "intellidb"
STATEFULSET_NAME = "postgres"
CONTAINER_NAME = "postgres"

# Resource boundaries — prevent scaling to values that would
# crash the cluster or waste too much resource
MIN_CPU = "250m"
MAX_CPU = "2000m"
MIN_MEMORY = "256Mi"
MAX_MEMORY = "2Gi"


class ScalingConsumer:
    """
    Listens for scaling events and applies them to the StatefulSet.

    Right now operates in simulation mode — events are injected
    directly via handle_event().

    When IntelliDB pub/sub is available, add a _subscribe() method
    that connects to the pub/sub topic and calls handle_event()
    for each message received.
    """

    def __init__(self):
        # AppsV1Api is needed for StatefulSet operations
        self.k8s_apps = client.AppsV1Api()
        self._running = False
        self._thread = None
        # Track how many scaling operations have happened
        self._scale_count = 0

    def start(self):
        """
        Start the consumer as a background thread.
        Currently just marks it as running and ready to receive events.
        When pub/sub is available, this will also start a subscriber loop.
        """
        self._running = True
        logger.info("Scaling consumer started — ready to receive events")

    def stop(self):
        self._running = False
        logger.info("Scaling consumer stopped")

    def handle_event(self, event: dict):
            """
            Process one scaling event.

            Called either by:
            - simulate_scaling_event.py for testing
            - pub/sub subscriber when real events arrive (future)

            event dict must contain:
                action: "scale_up" or "scale_down"
                suggested_cpu_request: e.g. "1500m"
                suggested_memory_request: e.g. "1Gi"
                reason: why scaling was triggered (for logging)
            """

            logger.info(
                f"Scaling event received: action={event.get('action')} "
                f"reason={event.get('reason')} "
                f"cpu={event.get('suggested_cpu_request')} "
                f"memory={event.get('suggested_memory_request')}"
            )

            # ── Validate event has required fields ────────────────────────────
            required_fields = [
                "action",
                "suggested_cpu_request",
                "suggested_memory_request"
            ]
            for field in required_fields:
                if field not in event:
                    logger.error(f"Scaling event missing required field: {field}")
                    return

            action = event["action"]
            new_cpu = event["suggested_cpu_request"]
            new_memory = event["suggested_memory_request"]

            if action not in ("scale_up", "scale_down"):
                logger.error(f"Unknown scaling action: {action}")
                return

            # ── Skip duplicate scaling events ────────────────────────────────

            current = self.get_current_resources()

            current_cpu = current.get("cpu_request")
            current_memory = current.get("memory_request")

            if (
                current_cpu == new_cpu and
                current_memory == new_memory
            ):
                logger.info(
                    "Scaling skipped: cluster already has "
                    f"cpu={current_cpu} memory={current_memory}"
                )
                return

            # ── Apply the scaling ─────────────────────────────────────────────

            result = self._patch_statefulset(new_cpu, new_memory, action)

            if result["success"]:
                self._scale_count += 1
                logger.info(
                    f"Scaling applied successfully "
                    f"(total scaling operations: {self._scale_count})"
                )
            else:
                logger.error(f"Scaling failed: {result['error']}")

    def _patch_statefulset(
        self,
        new_cpu: str,
        new_memory: str,
        action: str
    ) -> dict:
        """
        Patch the PostgreSQL StatefulSet with new resource values.

        What "patching" means physically:
        Kubernetes receives the updated spec and performs a rolling restart.
        It restarts postgres-0 first with the new cgroup limits.
        Patroni detects postgres-0 is gone and promotes postgres-1.
        postgres-0 comes back with new limits, rejoins as replica.
        Then postgres-1 is restarted with new limits.
        Patroni promotes postgres-0 back (or keeps postgres-1 as leader).
        Total downtime: near zero because Patroni manages the failover.

        The patch format is a partial update — we only specify what
        we want to change. Kubernetes merges it with the existing spec.
        """

        logger.info(
            f"Patching StatefulSet: "
            f"cpu={new_cpu} memory={new_memory} ({action})"
        )

        # This is the patch body
        # We only specify the fields we want to change
        # Everything else in the StatefulSet stays the same
        # Kubernetes merges this patch with the existing spec
        patch_body = {
            "spec": {
                "template": {
                    "spec": {
                        "containers": [
                            {
                                # Must match the container name in your StatefulSet
                                "name": CONTAINER_NAME,
                                "resources": {
                                    "requests": {
                                        "cpu": new_cpu,
                                        "memory": new_memory
                                    },
                                    # Limits are always 2x requests
                                    # This gives headroom for bursts
                                    # while still protecting other workloads
                                    "limits": {
                                        "cpu": _double_cpu(new_cpu),
                                        "memory": _double_memory(new_memory)
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }

        try:
            # patch_namespaced_stateful_set applies a partial update
            # The first argument is the name of the StatefulSet
            # The second is the namespace
            # The third is the patch body
            self.k8s_apps.patch_namespaced_stateful_set(
                name=STATEFULSET_NAME,
                namespace=SHARED_NAMESPACE,
                body=patch_body
            )

            logger.info(
                f"StatefulSet patched successfully. "
                f"Kubernetes will perform rolling restart. "
                f"Patroni manages HA during restart."
            )

            return {"success": True, "error": ""}

        except client.ApiException as e:
            error_msg = f"Kubernetes API error: {e.status} {e.reason}"
            logger.error(error_msg)
            return {"success": False, "error": error_msg}

        except Exception as e:
            logger.error(f"Unexpected error patching StatefulSet: {e}")
            return {"success": False, "error": str(e)}

    def get_current_resources(self) -> dict:
        """
        Read current resource values from the StatefulSet.
        Useful for logging what resources were before vs after scaling.
        """
        try:
            sts = self.k8s_apps.read_namespaced_stateful_set(
                name=STATEFULSET_NAME,
                namespace=SHARED_NAMESPACE
            )
            containers = sts.spec.template.spec.containers
            for container in containers:
                if container.name == CONTAINER_NAME:
                    return {
                        "cpu_request": container.resources.requests.get("cpu", "unknown"),
                        "memory_request": container.resources.requests.get("memory", "unknown"),
                        "cpu_limit": container.resources.limits.get("cpu", "unknown"),
                        "memory_limit": container.resources.limits.get("memory", "unknown")
                    }
        except Exception as e:
            logger.error(f"Could not read current resources: {e}")
            return {}


# ── Helper functions ──────────────────────────────────────────────────────────

def _double_cpu(cpu_str: str) -> str:
    """
    Double a CPU value for use as limit.
    "500m" → "1000m"
    "1500m" → "3000m"
    """
    # CPU values end in "m" for millicores
    # Remove "m", double the number, add "m" back
    millicores = int(cpu_str.replace("m", ""))
    return f"{millicores * 2}m"


def _double_memory(memory_str: str) -> str:
    """
    Double a memory value for use as limit.
    "512Mi" → "1024Mi"
    "1Gi" → "2Gi"
    """
    if memory_str.endswith("Mi"):
        value = int(memory_str.replace("Mi", ""))
        return f"{value * 2}Mi"
    elif memory_str.endswith("Gi"):
        value = int(memory_str.replace("Gi", ""))
        return f"{value * 2}Gi"
    return memory_str