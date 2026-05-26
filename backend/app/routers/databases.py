from fastapi import APIRouter

router = APIRouter(prefix="/v1/databases", tags=["databases"])

@router.get("/test")
def test():
    return {"message": "databases router working"}