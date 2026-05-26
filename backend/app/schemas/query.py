from pydantic import BaseModel

# What the frontend sends when running a query
class QueryRequest(BaseModel):
    sql: str
    timeout: int = 30   # default timeout 30 seconds

# What we send back after query execution
class QueryResponse(BaseModel):
    columns: list[str]
    rows: list[list]
    duration_ms: int
    row_count: int
    truncated: bool = False   # True if results were cut at 10,000 rows
    query_type: str           # READ or WRITE