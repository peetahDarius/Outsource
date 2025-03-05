from typing import Annotated
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

load_dotenv()

EMAIL_DATABASE_USERNAME = os.environ.get("EMAIL_DATABASE_USERNAME")
EMAIL_DATABASE_PASSWORD = os.environ.get("EMAIL_DATABASE_PASSWORD")
EMAIL_DATABASE_HOST = os.environ.get("EMAIL_DATABASE_HOST")
EMAIL_DATABASE_PORT = os.environ.get("EMAIL_DATABASE_PORT")
EMAIL_DATABASE_NAME = os.environ.get("EMAIL_DATABASE_NAME")

URL_DATABASE = f"postgresql://{EMAIL_DATABASE_USERNAME}:{EMAIL_DATABASE_PASSWORD}@{EMAIL_DATABASE_HOST }:{EMAIL_DATABASE_PORT}/{EMAIL_DATABASE_NAME}"
print(f"Connecting to database at {URL_DATABASE}")
engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]