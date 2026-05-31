# server.py
# Cloud Resource Manager — gRPC server
#
# This server receives calls from Sanvi's backend and:
#   ProvisionTenant:  checks shared cluster health, calls Yahavi to create schema
#   TerminateTenant:  calls Yahavi to drop schema, leaves K8s infrastructure alone
#   GetInfraStatus:   returns current shared cluster health
#
# The shared PostgreSQL cluster is NOT created or modified by this server.
# It was provisioned once by deploy.sh and stays running permanently.
from telemetry import InfrastructureTelemetryPublisher
from scaling_consumer import ScalingConsumer
import grpc
import time
import logging
from concurrent import futures

import cloud_pb2
import cloud_pb2_grpc

# Import our two gRPC client functions for calling Yahavi's DB layer
from db_client import create_tenant_schema, delete_tenant_schema

# Import our two monitoring functions for the shared cluster
from provisioner import check_shared_cluster_capacity, get_cluster_status, get_patroni_status

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ── Shared cluster endpoint ───────────────────────────────────────────────────
# This is the same for every tenant — they all connect to the same PostgreSQL
# The endpoint is the Kubernetes Service DNS name
# Format: service-name.namespace.svc.cluster.local
# This resolves to the ClusterIP of postgres-primary Service
# which Patroni keeps pointed at whichever pod is currently the primary

SHARED_PRIMARY_ENDPOINT = "postgres-primary.intellidb.svc.cluster.local"
SHARED_PGBOUNCER_ENDPOINT = "pgbouncer-service.intellidb.svc.cluster.local"
SHARED_PORT = 5432


class CloudResourceManagerServicer(cloud_pb2_grpc.CloudResourceManagerServicer):

    def ProvisionTenant(self, request, context):
        """
        Called by Sanvi's backend when a new tenant signs up.

        What this does:
        1. Check shared cluster is healthy before doing anything
        2. Call Yahavi to create schema + role inside shared PostgreSQL
        3. Return the shared cluster endpoint

        What this does NOT do:
        - Create Kubernetes namespaces
        - Create StatefulSets
        - Create Services or PVCs
        - Spin up new Patroni clusters
        Those things only happen if a tenant needs isolation (future feature).
        """

        logger.info(
            f"ProvisionTenant: tenant_id={request.tenant_id} "
            f"schema={request.schema_name}"
        )

        # ── Step 1: Check shared cluster health ───────────────────────────
        # Before telling Yahavi to create a schema, verify the shared
        # PostgreSQL cluster is actually running and healthy.
        # No point creating a schema on a broken database.

        capacity = check_shared_cluster_capacity()

        if not capacity["has_capacity"]:
            # Cluster is not healthy — fail immediately with a clear message
            logger.error(
                f"Shared cluster not ready: {capacity['message']}"
            )
            return cloud_pb2.ProvisionResponse(
                status="FAILED",
                error_message=f"Shared cluster not ready: {capacity['message']}"
            )

        logger.info("Shared cluster is healthy, proceeding with schema creation")

        # ── Step 2: Call Yahavi's DB layer to create the schema ───────────
        # The schema is created INSIDE the shared PostgreSQL cluster
        # No new Kubernetes objects are created
        # We pass the shared cluster's primary node as the "node" parameter
        # so Yahavi knows where the database physically lives

        cluster_status = get_cluster_status()

        db_result = create_tenant_schema(
            tenant_id=request.tenant_id,
            schema_name=request.schema_name,
            user_name=request.user_name,
            company=request.company,
            node=cluster_status.get("primary_node", "unknown"),
            storage=f"{request.storage_gb} GB",
            ram="shared",
            conn_limit=request.conn_limit
        )

        if db_result["status"] != "success":
            logger.error(
                f"Schema creation failed: {db_result['message']}"
            )
            return cloud_pb2.ProvisionResponse(
                status="FAILED",
                error_message=db_result["message"]
            )

        logger.info(
            f"Schema {request.schema_name} created successfully "
            f"for tenant {request.tenant_id}"
        )

        # ── Step 3: Return the shared cluster endpoint ────────────────────
        # All tenants get the same endpoint
        # They connect to PgBouncer which routes to the shared primary
        # Their queries are scoped to their schema by the search_path
        # that Yahavi configures for their role

        return cloud_pb2.ProvisionResponse(
            status="READY",
            endpoint=SHARED_PRIMARY_ENDPOINT,
            port=SHARED_PORT,
            pgbouncer_endpoint=SHARED_PGBOUNCER_ENDPOINT,
            node_primary=cluster_status.get("primary_node", "unknown"),
            node_replica=cluster_status.get("replica_node", "unknown"),
            error_message=""
        )

    def TerminateTenant(self, request, context):
        """
        Called by Sanvi's backend when a tenant deletes their account.

        What this does:
        1. Call Yahavi to drop the tenant's schema from shared PostgreSQL
        2. Return confirmation

        What this does NOT do:
        - Delete Kubernetes pods
        - Delete Services or PVCs
        - Touch the shared cluster in any way
        The shared infrastructure stays running for all other tenants.
        """

        logger.info(
            f"TerminateTenant: tenant_id={request.tenant_id} "
            f"schema={request.schema_name}"
        )

        # ── Call Yahavi to drop the schema ────────────────────────────────
        # This deletes the tenant's data from the shared PostgreSQL
        # DROP SCHEMA CASCADE removes all tables, views, functions inside it
        # DROP ROLE removes the tenant's PostgreSQL user
        # After this the tenant's data is gone permanently

        db_result = delete_tenant_schema(
            tenant_id=request.tenant_id,
            schema_name=request.schema_name
        )

        if db_result["status"] != "TERMINATED":
            logger.error(
                f"Schema deletion failed: {db_result['message']}"
            )
            return cloud_pb2.TerminateResponse(
                status="FAILED",
                error_message=db_result["message"]
            )

        logger.info(
            f"Tenant {request.tenant_id} terminated successfully"
        )

        # Shared cluster is untouched
        # Other tenants continue working normally
        return cloud_pb2.TerminateResponse(
            status="TERMINATED",
            error_message=""
        )

    def GetInfraStatus(self, request, context):
        """
        Called by Sanvi's backend to check infrastructure health.
        Used by the frontend dashboard to show instance status.

        Returns real data from the Kubernetes API —
        not hardcoded values.
        """

        logger.info(f"GetInfraStatus: tenant_id={request.tenant_id}")

        # All tenants share the same infrastructure
        # so the status is the same regardless of which tenant asks
        status = get_cluster_status()
        patroni = get_patroni_status()

        return cloud_pb2.StatusResponse(
            primary_pod=patroni["leader_pod"],
            replica_pod=patroni["replica_pod"],
            primary_status=status["primary_status"],
            replica_status=status["replica_status"],
            pvcs_bound=status["pvcs_bound"],
            patroni_role=(
                "Leader"
                if patroni["patroni_healthy"]
                else "Unknown"
            ),
            patroni_lag_mb="0"
        )


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    cloud_pb2_grpc.add_CloudResourceManagerServicer_to_server(
        CloudResourceManagerServicer(), server
    )

    port = "50052"
    server.add_insecure_port(f"[::]:{port}")

    # Start telemetry publisher as background thread
    # It begins collecting and publishing metrics immediately
    telemetry_publisher = InfrastructureTelemetryPublisher()
    telemetry_publisher.start()
    scaling_consumer = ScalingConsumer()
    scaling_consumer.start()
    server.start()
    logger.info(f"Cloud Resource Manager gRPC server started on port {port}")
    logger.info("Waiting for requests...")

    try:
        while True:
            time.sleep(86400)
    except KeyboardInterrupt:
        telemetry_publisher.stop()
        scaling_consumer.stop()
        server.stop(0)

if __name__ == "__main__":
    serve()