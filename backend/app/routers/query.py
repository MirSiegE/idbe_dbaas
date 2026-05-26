from fastapi import APIRouter

router = APIRouter(prefix="/v1/databases", tags=["query"])

@router.get("/test-query")
def test():
    return {"message": "query router working"}