from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest
from app.config import settings
import uuid

# bcrypt context for hashing passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#Converts plain password to bcrypt hash
def hash_password(password: str) -> str:
    return pwd_context.hash(password[:72])                          # bcrypt has a 72 character limit — truncate for safety

#Checks if plain password matches stored hash
def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain[:72], hashed)

#Creates a signed JWT token
def create_token(data: dict, expires_delta: timedelta, token_type: str) -> str:
    payload = data.copy()
    payload.update({
        "exp": datetime.now(timezone.utc) + expires_delta,
        "iat": datetime.now(timezone.utc),
        "type": token_type,
        "jti": str(uuid.uuid4())                                    # unique token ID for blocklist
    })
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

#Creates short-lived access token (15 mins)
def create_access_token(user_id: str) -> str:
    return create_token(
        {"sub": user_id},
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        "access"
    )

#Creates long-lived refresh token (7 days)
def create_refresh_token(user_id: str) -> str:
    return create_token(
        {"sub": user_id},
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        "refresh"
    )

#Registers a new user
def signup(db: Session, request: SignupRequest) -> User:
    # Check if email already exists
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise ValueError("Email already registered")
    
    # Create new user with hashed password
    user = User(
        email=request.email,
        password_hash=hash_password(request.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

#Verifies credentials and returns user
def login(db: Session, request: LoginRequest) -> User:
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise ValueError("Invalid email or password")
    return user

#Decodes and validates a JWT token
def decode_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
    except JWTError:
        raise ValueError("Invalid or expired token")