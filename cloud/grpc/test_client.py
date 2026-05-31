import grpc
import cloud_pb2
import cloud_pb2_grpc
import time

channel = grpc.insecure_channel("localhost:50052")
stub = cloud_pb2_grpc.CloudResourceManagerStub(channel)

# -----------------------------
# PROVISION TEST
# -----------------------------
print("Testing ProvisionTenant...")
print("(This will take 1-2 minutes)")
print("")

response = stub.ProvisionTenant(
    cloud_pb2.ProvisionRequest(
        tenant_id=1001,
        schema_name="tenant_1001",
        user_name="alice",
        company="XXYY",
        tier="standard",
        storage_gb=1,
        conn_limit=50
    )
)

print("=== PROVISION RESPONSE ===")
print(f"Status:        {response.status}")
print(f"Endpoint:      {response.endpoint}")
print(f"Node primary:  {response.node_primary}")
print(f"Node replica:  {response.node_replica}")
print(f"Error:         {response.error_message}")
print("")

# -----------------------------
# TERMINATION TEST
# -----------------------------
print("Waiting 10 seconds before termination...")
time.sleep(10)

print("")
print("Testing TerminateTenant...")
print("")

terminate_response = stub.TerminateTenant(
    cloud_pb2.TerminateRequest(
        tenant_id=1001,
        schema_name="tenant_1001"
    )
)

print("=== TERMINATION RESPONSE ===")
print(f"Status: {terminate_response.status}")
print(f"Error:  {terminate_response.error_message}")