from .database import SessionLocal
from .models import Credentials
from sqlalchemy.orm import Session

def get_values(db: Session):
    credentials = db.query(Credentials).filter(Credentials.custom_id == 1).first()
    return credentials.host, credentials.username, credentials.password, credentials.port

with SessionLocal() as db:
    HOST, USERNAME, PASSWORD, PORT = get_values(db)
