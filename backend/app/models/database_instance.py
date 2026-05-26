from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid
from app.database import Base

class DatabaseInstance(Base):
    __tablename__ = "database_instances"

    id = Column(String, primary_key = True)                                    # Unique ID in db_xxxx format

    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))       # The user who created this DB

    name = Column(String, nullable=False)                                      # Name given by the user

    status = Column(String, default="RUNNING")                                 # Current status of the DB

    pod_name = Column(String)                                                  # Kubernetes pod identifier

    # Connection details
    port = Column(Integer)
    host = Column(String)
    region = Column(String)

    # Timestamps
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    terminated_at = Column(DateTime, nullable=True)

class InstanceMember(Base):
    __tablename__ = "instance_member"

    instance_id = Column(String, ForeignKey("database_instances.id"), primary_key=True)   # Which DB this membership belongs to

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True) # Which user has access

    role = Column(String, nullable=False)                                                 # User's role

    granted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))        # When the access was granted