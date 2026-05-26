from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

engine = create_engine(settings.DATABASE_URL)          # Creates connection to PostgreSQL

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)   # Each re gets its own DB sesison

Base = declarative_base()                            # Base class for all models

def get_db():                                        # gives a DB session to each route
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

