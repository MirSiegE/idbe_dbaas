# telemetry.py
# Infrastructure telemetry publisher
#
# Runs as a background thread alongside the gRPC server
# Every 30 seconds, reads cluster state from Kubernetes
# and publishes infrastructure metrics to the pub/sub system
#
# What this layer publishes (cluster-level):
#   - pod health (Running/NotReady)
#   - which node each pod is on
#   - PVC status
#   - replication lag (when Patroni API is queryable)
#
# What this layer does NOT publish (Yahavi's responsibility):
#   - per-tenant query counts
#   - per-tenant schema sizes
#   - per-tenant connection counts
#   Those come from PostgreSQL internals (pg_stat_statements etc.)

import time
import threading
import logging
import json
from datetime import datetime, timezone
from kubernetes import client
from provisioner import get_patroni_status

logger = logging.getLogger(__name__)

# How often to collect and publish metrics (seconds)
SCRAPE_INTERVAL = 30

# Namespace where the shared cluster lives
SHARED_NAMESPACE = "intellidb"


class InfrastructureTelemetryPublisher:
    """
    Background thread that periodically collects cluster metrics
    and publishes them to the event bus.

    Usage:
        publisher = InfrastructureTelemetryPublisher()
        publisher.start()   # starts background thread
        publisher.stop()    # stops gracefully on shutdown
    """

    def __init__(self):
        self.k8s_core = client.CoreV1Api()
        self._running = False
        self._thread = None

    def start(self):
        """
        Start the background collection thread.

        threading.Thread creates a new thread of execution
        daemon=True means: if the main program exits, this thread
        exits too. Without daemon=True the server would hang
        on shutdown waiting for this thread to finish.
        """
        self._running = True
        self._thread = threading.Thread(
            target=self._run_loop,
            daemon=True,
            name="telemetry-publisher"
        )
        self._thread.start()
        logger.info(
            f"Telemetry publisher started "
            f"(interval: {SCRAPE_INTERVAL}s)"
        )

    def stop(self):
        """Stop the background thread gracefully."""
        self._running = False
        logger.info("Telemetry publisher stopped")

    def _run_loop(self):
        """
        The main loop that runs in the background thread.
        Collects metrics, publishes them, waits, repeats.
        """
        while self._running:
            try:
                metrics = self._collect_metrics()
                self._publish(metrics)
            except Exception as e:
                # Never let a collection error crash the thread
                # Log it and continue — next collection will retry
                logger.error(f"Telemetry collection error: {e}")

            # Wait before next collection
            # time.sleep releases the thread so other work can happen
            time.sleep(SCRAPE_INTERVAL)

    def _collect_metrics(self) -> dict:
        """
        Read current cluster state from Kubernetes API.

        Returns a dict of metrics ready to be published.
        All values come from real Kubernetes API calls —
        nothing is hardcoded here.
        """

        metrics = {
            "event": "infra.telemetry",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "namespace": SHARED_NAMESPACE,
        }

        # ── Pod metrics ───────────────────────────────────────────────────

        try:
            pod0 = self.k8s_core.read_namespaced_pod(
                "postgres-0", SHARED_NAMESPACE
            )
            metrics["primary_pod"] = "postgres-0"
            metrics["primary_phase"] = pod0.status.phase

            # Check if all containers in the pod are ready
            # A pod can be Running but containers not yet passing probes
            containers_ready = all(
                cs.ready
                for cs in (pod0.status.container_statuses or [])
            )
            metrics["primary_ready"] = containers_ready
            metrics["primary_node"] = pod0.spec.node_name or "unknown"
            metrics["primary_restart_count"] = sum(
                cs.restart_count
                for cs in (pod0.status.container_statuses or [])
            )

        except client.ApiException:
            metrics["primary_phase"] = "NotFound"
            metrics["primary_ready"] = False
            metrics["primary_node"] = "unknown"
            metrics["primary_restart_count"] = 0

        try:
            pod1 = self.k8s_core.read_namespaced_pod(
                "postgres-1", SHARED_NAMESPACE
            )
            metrics["replica_pod"] = "postgres-1"
            metrics["replica_phase"] = pod1.status.phase

            containers_ready = all(
                cs.ready
                for cs in (pod1.status.container_statuses or [])
            )
            metrics["replica_ready"] = containers_ready
            metrics["replica_node"] = pod1.spec.node_name or "unknown"
            metrics["replica_restart_count"] = sum(
                cs.restart_count
                for cs in (pod1.status.container_statuses or [])
            )

        except client.ApiException:
            metrics["replica_phase"] = "NotFound"
            metrics["replica_ready"] = False
            metrics["replica_node"] = "unknown"
            metrics["replica_restart_count"] = 0

        # ── PVC metrics ───────────────────────────────────────────────────

        try:
            pvc0 = self.k8s_core.read_namespaced_persistent_volume_claim(
                "postgres-data-postgres-0", SHARED_NAMESPACE
            )
            metrics["primary_pvc_phase"] = pvc0.status.phase
            metrics["primary_pvc_capacity"] = (
                pvc0.status.capacity.get("storage", "unknown")
                if pvc0.status.capacity else "unknown"
            )
        except client.ApiException:
            metrics["primary_pvc_phase"] = "NotFound"
            metrics["primary_pvc_capacity"] = "unknown"

        try:
            pvc1 = self.k8s_core.read_namespaced_persistent_volume_claim(
                "postgres-data-postgres-1", SHARED_NAMESPACE
            )
            metrics["replica_pvc_phase"] = pvc1.status.phase
        except client.ApiException:
            metrics["replica_pvc_phase"] = "NotFound"

        # ── Overall cluster health ────────────────────────────────────────
        patroni = get_patroni_status()

        metrics["patroni_leader"] = patroni["leader_pod"]
        metrics["patroni_replica"] = patroni["replica_pod"]
        metrics["patroni_timeline"] = patroni["timeline"]
        metrics["patroni_healthy"] = patroni["patroni_healthy"]
        metrics["cluster_healthy"] = (
            metrics.get("primary_ready", False) and
            metrics.get("replica_ready", False) and
            metrics.get("primary_pvc_phase") == "Bound" and
            metrics.get("replica_pvc_phase") == "Bound" and 
            patroni["patroni_healthy"]
        )

        return metrics

    def _publish(self, metrics: dict):
        """
        Publish metrics to the event bus.

        Right now this logs the metrics as JSON.
        When IntelliDB pub/sub is connected, replace the
        logger.info line with the actual pub/sub publish call.

        The JSON format is already correct for pub/sub —
        just change the transport.
        """

        metrics_json = json.dumps(metrics, indent=2)

        # TODO: replace with real pub/sub publish when available
        # Example: pubsub_client.publish("infra.telemetry", metrics_json)
        logger.info(f"[TELEMETRY] Publishing metrics:\n{metrics_json}")