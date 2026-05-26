from pydantic import BaseModel, EmailStr  

# What the frontend sends when signing up
class SignupRequest(BaseModel):
    email: EmailStr
    password: str

# What the frontend sends when logging in
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# What we send back after successful signup/login
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

# What the frontend sends when refreshing token
class RefreshRequest(BaseModel):
    refresh_token: str