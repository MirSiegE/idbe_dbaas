# Keywords that indicate a READ query — routed to Replica pod
READ_KEYWORDS = {"select", "show", "describe", "explain"}

# Keywords that indicate a WRITE query — routed to Primary pod
WRITE_KEYWORDS = {"insert", "update", "delete", "create", "drop", "alter", "truncate"}

def parse_query_type(sql: str) -> str:
    """
    Reads the first word of the SQL query
    and decides if it is a READ or WRITE
    """
    if not sql.strip():
        raise ValueError("Query cannot be empty")
    
    first_word = sql.strip().split()[0].lower()
    
    if first_word in READ_KEYWORDS:
        return "READ"
    if first_word in WRITE_KEYWORDS:
        return "WRITE"
    
    raise ValueError(f"Unrecognised query type: '{first_word}'")

def check_role_permission(role: str, query_type: str) -> bool:
    """
    Checks if the user's role allows them
    to run this type of query

    OWNER  — can run everything
    EDITOR — can run READ and WRITE but not DDL (CREATE, DROP, ALTER)
    VIEWER — can only run READ (SELECT)
    """
    # DDL queries that only OWNER can run
    DDL_KEYWORDS = {"create", "drop", "alter", "truncate"}

    if role == "OWNER":
        return True
    
    if role == "EDITOR":
        # Editor cannot run DDL queries
        first_word = query_type.strip().split()[0].lower()
        if first_word in DDL_KEYWORDS:
            return False
        return True
    
    if role == "VIEWER":
        # Viewer can only SELECT
        return query_type == "READ"
    
    return False