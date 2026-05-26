from fastapi import APIRouter

router = APIRouter(prefix="/v1/auth", tags=["auth"])

@router.get("/test")
def test():
    return {"message": "auth router working"}