from fastapi import FastAPI
from app.database import Base, engine
from app.routers import auth, databases, query

# Create all database tables automatically on startup
Base.metadata.create_all(bind=engine)

# Create the FastAPI app
app = FastAPI(
    title="DBaaS Platform",
    description="Database-as-a-Service Backend API",
    version="1.0.0"
)

# Register all routers
app.include_router(auth.router)
app.include_router(databases.router)
app.include_router(query.router)

# Health check endpoint
@app.get("/health")
def health():
    return {"status": "ok"}