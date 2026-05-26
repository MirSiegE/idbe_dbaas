from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str                           # PostgreSQL Metadata DB connection URL
    SECRET_KEY: str                             # JWT tokens secret key
    ALGORITHM: str = "HS256"                    # JWT algorithm
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15       # JWT access token expiration time
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7          # How long the refresh token is valid for

    class Config:
        env_file = ".env"

settings = Settings()                           # Single settings obj for whole app