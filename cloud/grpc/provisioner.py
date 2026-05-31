# provisioner.py
# Cloud Resource Manager — shared cluster monitoring
#
# IMPORTANT: This file does NOT create or delete Kubernetes objects per tenant.
# The shared PostgreSQL cluster is provisioned ONCE by deploy.sh at platform startup.
# This file only:
#   1. Checks if the shared cluster is healthy and has capacity
#   2. Returns current cluster status for monitoring/observability
#
# Per-tenant operations (schema creation, deletion) are handled by
# Yahavi's Database Resource Manager layer, which we call via gRPC.
import json
import subprocess
import urllib.request
import urllib.error
import logging
from kubernetes import client, config

logger = logging.getLogger(__name__)

# ── Kubernetes client setup ───────────────────────────────────────────────────

def _load_k8s_config():
    """
    Load Kubernetes configuration so we can query the cluster.

    Tries in-cluster config first (when running as a pod inside Kubernetes).
    Falls back to local kubeconfig (when running on your Mac with minikube).

    In-cluster config:  reads a token mounted into the pod automatically
                        by Kubernetes at /var/run/secrets/kubernetes.io/serviceaccount
    Local kubeconfig:   reads ~/.kube/config which kubectl also uses
                        minikube wrote this file when you ran minikube start
    """
    try:
        config.load_incluster_config()
        logger.info("Using in-cluster Kubernetes config")
    except config.ConfigException:
        config.load_kube_config()
        logger.info("Using local kubeconfig")

_load_k8s_config()

# CoreV1Api gives access to: pods, services, PVCs, namespaces, secrets, configmaps
# We only need read operations here — we are not creating or deleting anything
k8s_core = client.CoreV1Api()

# The namespace where your shared cluster lives
# This is fixed — it was created by deploy.sh
SHARED_NAMESPACE = "intellidb"

# Pod names in the shared cluster — also fixed
PRIMARY_POD = "postgres-0"
REPLICA_POD = "postgres-1"

# PVC names — created by StatefulSet, also fixed
PRIMARY_PVC = "postgres-data-postgres-0"
REPLICA_PVC = "postgres-data-postgres-1"


# ── Capacity check ────────────────────────────────────────────────────────────

def check_shared_cluster_capacity() -> dict:
    """
    Check whether the shared PostgreSQL cluster is healthy
    and able to accept new tenants.

    This is called by ProvisionTenant before creating a new schema.
    If the cluster is unhealthy, we return an error instead of
    calling Yahavi to create a schema on a broken database.

    What we check:
    1. Primary pod is Running — if postgres-0 is down, nobody can write
    2. Replica pod is Running — if postgres-1 is down, we have no HA
    3. Primary PVC is Bound — if storage is not attached, data is at risk

    Returns:
        has_capacity: bool — True if safe to provision a new tenant
        primary_running: bool
        replica_running: bool
        storage_ok: bool
        message: human-readable summary
    """

    result = {
        "has_capacity": False,
        "primary_running": False,
        "replica_running": False,
        "storage_ok": False,
        "message": ""
    }

    try:
        # ── Check primary pod ─────────────────────────────────────────────
        # read_namespaced_pod fetches the current state of a specific pod
        # Arguments: pod name, namespace
        # Returns a V1Pod object with all pod details
        primary_pod = k8s_core.read_namespaced_pod(
            name=PRIMARY_POD,
            namespace=SHARED_NAMESPACE
        )

        # pod.status.phase is a string: "Running", "Pending", "Failed", "Unknown"
        # We check container_statuses too because a pod can be "Running"
        # but its containers might not be ready yet (probe not passed)
        primary_phase = primary_pod.status.phase
        primary_containers_ready = all(
            cs.ready
            for cs in (primary_pod.status.container_statuses or [])
        )

        result["primary_running"] = (
            primary_phase == "Running" and primary_containers_ready
        )

        # ── Check replica pod ─────────────────────────────────────────────
        replica_pod = k8s_core.read_namespaced_pod(
            name=REPLICA_POD,
            namespace=SHARED_NAMESPACE
        )

        replica_phase = replica_pod.status.phase
        replica_containers_ready = all(
            cs.ready
            for cs in (replica_pod.status.container_statuses or [])
        )

        result["replica_running"] = (
            replica_phase == "Running" and replica_containers_ready
        )

        # ── Check primary PVC ─────────────────────────────────────────────
        # read_namespaced_persistent_volume_claim fetches PVC state
        # pvc.status.phase is "Bound", "Pending", or "Lost"
        # "Bound" means the disk is successfully attached and usable
        # "Lost" means the disk was detached — data may be inaccessible
        primary_pvc = k8s_core.read_namespaced_persistent_volume_claim(
            name=PRIMARY_PVC,
            namespace=SHARED_NAMESPACE
        )

        result["storage_ok"] = primary_pvc.status.phase == "Bound"

        # ── Overall capacity decision ─────────────────────────────────────
        # All three must be healthy for us to accept a new tenant
        result["has_capacity"] = (
            result["primary_running"] and
            result["replica_running"] and
            result["storage_ok"]
        )

        if result["has_capacity"]:
            result["message"] = "Shared cluster is healthy"
        else:
            issues = []
            if not result["primary_running"]:
                issues.append("primary pod not ready")
            if not result["replica_running"]:
                issues.append("replica pod not ready")
            if not result["storage_ok"]:
                issues.append("primary PVC not bound")
            result["message"] = "Cluster issues: " + ", ".join(issues)

        logger.info(f"Capacity check: {result['message']}")
        return result

    except client.ApiException as e:
        # ApiException is raised when the Kubernetes API call fails
        # status 404 means the pod or PVC doesn't exist at all
        # This would happen if deploy.sh was never run
        logger.error(f"Kubernetes API error during capacity check: {e.status} {e.reason}")
        result["message"] = f"Kubernetes API error: {e.reason}"
        return result

    except Exception as e:
        logger.error(f"Unexpected error during capacity check: {e}")
        result["message"] = f"Unexpected error: {str(e)}"
        return result


# ── Cluster status ────────────────────────────────────────────────────────────

def get_cluster_status() -> dict:
    """
    Return detailed current status of the shared PostgreSQL cluster.

    Called by GetInfraStatus gRPC function.
    Returns pod states, which nodes they are on, and PVC status.

    Note on Patroni role:
    We report the pod name as primary/replica based on pod index.
    postgres-0 starts as leader but after failovers this may change.
    For accurate Patroni role, you would query Patroni's REST API
    on port 8008 — that's a future improvement.
    For Phase 1, reporting pod running status is sufficient.
    """

    status = {
        "primary_pod": PRIMARY_POD,
        "replica_pod": REPLICA_POD,
        "primary_status": "Unknown",
        "replica_status": "Unknown",
        "primary_node": "Unknown",
        "replica_node": "Unknown",
        "pvcs_bound": False,
        "error": ""
    }

    try:
        # ── Pod status ────────────────────────────────────────────────────
        primary_pod = k8s_core.read_namespaced_pod(
            name=PRIMARY_POD,
            namespace=SHARED_NAMESPACE
        )
        replica_pod = k8s_core.read_namespaced_pod(
            name=REPLICA_POD,
            namespace=SHARED_NAMESPACE
        )

        status["primary_status"] = primary_pod.status.phase
        status["replica_status"] = replica_pod.status.phase

        # spec.node_name is which physical node the pod is running on
        # This is set by the Kubernetes scheduler when the pod is placed
        # For your minikube setup: "minikube" or "minikube-m02"
        status["primary_node"] = primary_pod.spec.node_name or "Unknown"
        status["replica_node"] = replica_pod.spec.node_name or "Unknown"

        # ── PVC status ────────────────────────────────────────────────────
        pvc0 = k8s_core.read_namespaced_persistent_volume_claim(
            name=PRIMARY_PVC,
            namespace=SHARED_NAMESPACE
        )
        pvc1 = k8s_core.read_namespaced_persistent_volume_claim(
            name=REPLICA_PVC,
            namespace=SHARED_NAMESPACE
        )

        # Both PVCs must be Bound for full confidence
        status["pvcs_bound"] = (
            pvc0.status.phase == "Bound" and
            pvc1.status.phase == "Bound"
        )

        logger.info(
            f"Cluster status: primary={status['primary_status']} "
            f"on {status['primary_node']}, "
            f"replica={status['replica_status']} "
            f"on {status['replica_node']}"
        )

        return status

    except client.ApiException as e:
        logger.error(f"Kubernetes API error during status check: {e.status} {e.reason}")
        status["error"] = f"Kubernetes API error: {e.reason}"
        return status

    except Exception as e:
        logger.error(f"Unexpected error during status check: {e}")
        status["error"] = str(e)
        return status
    
def get_patroni_status():

    result = {
        "leader_pod": "unknown",
        "replica_pod": "unknown",
        "timeline": 0,
        "patroni_healthy": False
    }

    try:

        pod0 = subprocess.run(
            [
                "kubectl",
                "exec",
                "postgres-0",
                "-n",
                SHARED_NAMESPACE,
                "--",
                "curl",
                "-s",
                "http://localhost:8008/patroni"
            ],
            capture_output=True,
            text=True
        )

        pod1 = subprocess.run(
            [
                "kubectl",
                "exec",
                "postgres-1",
                "-n",
                SHARED_NAMESPACE,
                "--",
                "curl",
                "-s",
                "http://localhost:8008/patroni"
            ],
            capture_output=True,
            text=True
        )

        pod0_data = json.loads(pod0.stdout)
        pod1_data = json.loads(pod1.stdout)

        if pod0_data.get("role") == "master":
            result["leader_pod"] = "postgres-0"
            result["replica_pod"] = "postgres-1"
            result["timeline"] = pod0_data.get("timeline", 0)

        elif pod1_data.get("role") == "master":
            result["leader_pod"] = "postgres-1"
            result["replica_pod"] = "postgres-0"
            result["timeline"] = pod1_data.get("timeline", 0)

        result["patroni_healthy"] = True

        return result

    except Exception as e:

        logger.error(f"Patroni status error: {e}")

        return result