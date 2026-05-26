from sqlalchemy.orm import Session
from app.models.database_instance import DatabaseInstance, InstanceMember
from app.schemas.database import CreateDatabaseRequest
from datetime import datetime, timezone
import random
import string

#Generates a unique ID like db_k8f2xp
def generate_db_id() -> str:
    suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return f"db_{suffix}"

#Creates a new database instance
def create_database(db: Session, request: CreateDatabaseRequest, owner_id: str) -> DatabaseInstance:
    
    ''' TODO: replace with real gRPC call to Cloud Orchestration Layer '''
    
    instance = DatabaseInstance(
        id=generate_db_id(),
        owner_id=owner_id,
        name=request.name,
        status="RUNNING",
        pod_name=f"pod-{generate_db_id()}",   # stub K8s pod name
        port=5432,
        host="localhost",
        region=request.region
    )
    db.add(instance)

    # Automatically make creator the OWNER
    member = InstanceMember(
        instance_id=instance.id,
        user_id=owner_id,
        role="OWNER"
    )
    db.add(member)
    db.commit()
    db.refresh(instance)
    return instance

#Returns all non-terminated databases for a user
def get_user_databases(db: Session, owner_id: str):
    return db.query(DatabaseInstance).filter(
        DatabaseInstance.owner_id == owner_id,
        DatabaseInstance.status != "TERMINATED"
    ).all()

#Returns a specific database after ownership check
def get_database(db: Session, db_id: str, user_id: str) -> DatabaseInstance:
    instance = db.query(DatabaseInstance).filter(
        DatabaseInstance.id == db_id
    ).first()

    if not instance:
        raise ValueError("Database not found")
    if str(instance.owner_id) != str(user_id):
        raise PermissionError("You do not own this database")
    return instance

#Pauses a running database
def stop_database(db: Session, db_id: str, user_id: str) -> DatabaseInstance:
    instance = get_database(db, db_id, user_id)
    if instance.status != "RUNNING":
        raise ValueError("Database is not running")

    ''' TODO: replace with real gRPC call to stop K8s pods for this DB '''
    
    instance.status = "PAUSED"
    db.commit()
    db.refresh(instance)
    return instance

#Resumes a paused database
def start_database(db: Session, db_id: str, user_id: str) -> DatabaseInstance:
    instance = get_database(db, db_id, user_id)
    if instance.status != "PAUSED":
        raise ValueError("Database is not paused")

    ''' TODO: replace with real gRPC call to start K8s pods for this DB '''

    instance.status = "RUNNING"
    db.commit()
    db.refresh(instance)
    return instance

#Permanently deletes a database
def terminate_database(db: Session, db_id: str, user_id: str) -> DatabaseInstance:
    instance = get_database(db, db_id, user_id)
    if instance.status == "TERMINATED":
        raise ValueError("Database is already terminated")

    ''' TODO: replace with real gRPC call to delete K8s pods for this DB '''

    instance.status = "TERMINATED"
    instance.terminated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(instance)
    return instance