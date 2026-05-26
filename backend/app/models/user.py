from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)    # Unique user ID automatically generated

    email = Column(String, unique=True, nullable=False, index=True)                 # Email should be unique across all users

    password_hash = Column(String, nullable=False)                                  # Password stored as bycrypt hash only

    is_active = Column(Boolean, default=True)                                      # Whether the user is active

    created_at = created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))      # Timestamp when user signed up
    