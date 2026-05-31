# db_client.py
# This is YOUR layer calling YAHAVI'S database layer
# You call this after infrastructure is provisioned
# and during termination workflows

import grpc
import dbmanager_pb2
import dbmanager_pb2_grpc
import logging

logger = logging.getLogger(__name__)

# Yahavi's gRPC server address
# When running locally for testing: localhost:50051
# When running inside Kubernetes: her service name and port
# Ask Yahavi what her Kubernetes service name will be
# For now we use localhost for local testing
DB_MANAGER_ADDRESS = "localhost:50051"


def create_tenant_schema(
    tenant_id: int,
    schema_name: str,
    user_name: str,
    company: str,
    node: str,       # you get this from kubectl after pod is scheduled
    storage: str,    # you get this from the tier config e.g. "10 GB"
    ram: str,        # you get this from the tier config e.g. "4 GB"
    conn_limit: int  # from tier config
) -> dict:
    """
    Call Yahavi's DB layer to create a schema after
    infrastructure is ready.

    Returns dict with status and message.
    """

    try:
        # Open a connection to Yahavi's gRPC server
        # insecure_channel = no TLS, fine for internal cluster communication
        channel = grpc.insecure_channel(DB_MANAGER_ADDRESS)

        # Create a stub — this is the client-side object that has
        # all of Yahavi's functions available to call
        stub = dbmanager_pb2_grpc.DbManagerStub(channel)

        logger.info(f"Calling CreateTenantSchema for tenant {tenant_id}")

        # Build the request object using the generated message class
        request = dbmanager_pb2.CreateSchemaRequest(
            tenant_id=tenant_id,
            schema_name=schema_name,
            user_name=user_name,
            company=company,
            node=node,
            storage=storage,
            ram=ram,
            conn_limit=conn_limit
        )

        # Make the actual gRPC call
        # This goes over the network to Yahavi's server
        response = stub.CreateTenantSchema(request)

        logger.info(f"CreateTenantSchema response: {response.status} — {response.message}")

        return {
            "status": response.status,
            "schema_name": response.schema_name,
            "message": response.message
        }

    except grpc.RpcError as e:
        # grpc.RpcError is raised when the call fails
        # e.code() gives the error type (UNAVAILABLE, NOT_FOUND, etc.)
        # e.details() gives the human-readable error message
        logger.error(f"gRPC call to DB layer failed: {e.code()} — {e.details()}")
        return {
            "status": "error",
            "schema_name": schema_name,
            "message": f"DB layer unreachable: {e.details()}"
        }


def delete_tenant_schema(tenant_id: int, schema_name: str) -> dict:
    """
    Call Yahavi's DB layer to delete a schema during
    tenant termination.

    Returns dict with status and message.
    """

    try:
        channel = grpc.insecure_channel(DB_MANAGER_ADDRESS)
        stub = dbmanager_pb2_grpc.DbManagerStub(channel)

        logger.info(f"Calling DeleteTenantSchema for tenant {tenant_id}")

        request = dbmanager_pb2.DeleteSchemaRequest(
            tenant_id=tenant_id,
            schema_name=schema_name
        )

        response = stub.DeleteTenantSchema(request)

        logger.info(f"DeleteTenantSchema response: {response.status} — {response.message}")

        return {
            "status": response.status,
            "schema_name": response.schema_name,
            "message": response.message
        }

    except grpc.RpcError as e:
        logger.error(f"gRPC call to DB layer failed: {e.code()} — {e.details()}")
        return {
            "status": "error",
            "schema_name": schema_name,
            "message": f"DB layer unreachable: {e.details()}"
        }