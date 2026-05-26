from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.database import CreateDatabaseRequest, DatabaseResponse
from app.services import db_service, auth_service

router = APIRouter(prefix="/v1/databases", tags=["databases"])
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):                #Extracts and validates JWT from request header
    try:
        payload = auth_service.decode_token(credentials.credentials)
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        return payload.get("sub")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@router.post("", response_model=DatabaseResponse, status_code=201)
def create_database(
    request: CreateDatabaseRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Creates a new database for the logged in user"""
    return db_service.create_database(db, request, user_id)

@router.get("", response_model=List[DatabaseResponse])
def list_databases(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Returns all databases owned by the logged in user"""
    return db_service.get_user_databases(db, user_id)

@router.get("/{db_id}", response_model=DatabaseResponse)
def get_database(
    db_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Returns details of a specific database"""
    try:
        return db_service.get_database(db, db_id, user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.post("/{db_id}/start", response_model=DatabaseResponse)
def start_database(
    db_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Resumes a paused database"""
    try:
        return db_service.start_database(db, db_id, user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.post("/{db_id}/stop", response_model=DatabaseResponse)
def stop_database(
    db_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Pauses a running database"""
    try:
        return db_service.stop_database(db, db_id, user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

@router.delete("/{db_id}", status_code=204)
def terminate_database(
    db_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Permanently terminates a database"""
    try:
        db_service.terminate_database(db, db_id, user_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))