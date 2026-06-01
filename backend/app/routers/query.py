from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import time
from app.schemas.query import QueryRequest, QueryResponse
from app.services import auth_service
from app.services.query_service import parse_query_type, check_role_permission

router = APIRouter(prefix="/v1/databases", tags=["query"])
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):     #Extracts and validates JWT from request header
    try:
        payload = auth_service.decode_token(credentials.credentials)
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        return payload.get("sub")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@router.post("/{db_id}/query", response_model=QueryResponse)
def execute_query(
    db_id: str,
    request: QueryRequest,
    user_id: str = Depends(get_current_user)
):
    """
    Receives a SQL query, checks role permission,
    parses it as READ or WRITE, routes accordingly
    READ  → Replica pod (SELECT)
    WRITE → Primary pod (INSERT, UPDATE, DELETE etc)
    """

    ''' TODO: fetch real role from Metadata DB using db_id + user_id '''

    role = "EDITOR"                                                                      # stub — will be replaced with DB lookup

    # Step 1: parse query type
    try:
        query_type = parse_query_type(request.sql)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Step 2: check if role allows this query type
    if not check_role_permission(role, query_type):
        raise HTTPException(
            status_code=403,
            detail=f"Your role '{role}' is not allowed to run {query_type} queries"
        )

    # Step 3: route to correct pod and execute
    # TODO: replace stub with real asyncpg connection to K8s pod
    start = time.time()

    if query_type == "READ":
        # Routes to Replica pod
        stub_result = {
            "columns": ["id", "name", "status"],
            "rows": [[1, "my_database", "RUNNING"], [2, "test_db", "PAUSED"]]
        }
    else:
        # Routes to Primary pod
        stub_result = {
            "columns": ["affected_rows"],
            "rows": [[1]]
        }

    duration = int((time.time() - start) * 1000)

    return QueryResponse(
        columns=stub_result["columns"],
        rows=stub_result["rows"],
        duration_ms=duration,
        row_count=len(stub_result["rows"]),
        truncated=False,
        query_type=query_type
    )