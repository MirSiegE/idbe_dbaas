from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# What the frontend sends when creating a database
class CreateDatabaseRequest(BaseModel):
    name: str
    size: str       # small / medium / large
    region: str

# What we send back for any database response
class DatabaseResponse(BaseModel):
    id: str
    name: str
    status: str
    host: Optional[str] = None
    port: Optional[int] = None
    region: str
    created_at: datetime

    class Config:
        # Allows SQLAlchemy model to be converted to this schema
        from_attributes = True