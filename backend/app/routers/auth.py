from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, RefreshRequest
from app.services import auth_service

router = APIRouter(prefix="/v1/auth", tags=["auth"])

@router.post("/signup", response_model=TokenResponse)
def signup(request: SignupRequest, db: Session = Depends(get_db)):               #Registers a new user and returns tokens     
    try:
        user = auth_service.signup(db, request)
        return TokenResponse(
            access_token=auth_service.create_access_token(str(user.id)),
            refresh_token=auth_service.create_refresh_token(str(user.id))
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):                 #Logs in a user and returns tokens
    try:
        user = auth_service.login(db, request)
        return TokenResponse(
            access_token=auth_service.create_access_token(str(user.id)),
            refresh_token=auth_service.create_refresh_token(str(user.id))
        )
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/refresh", response_model=TokenResponse)
def refresh(request: RefreshRequest):                                             #Issues a new access token using refresh token
    try:
        payload = auth_service.decode_token(request.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id = payload.get("sub")
        return TokenResponse(
            access_token=auth_service.create_access_token(user_id),
            refresh_token=auth_service.create_refresh_token(user_id)
        )
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))