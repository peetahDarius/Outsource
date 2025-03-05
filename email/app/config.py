from .database import SessionLocal
from .models import Credentials
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
import pika

load_dotenv()

def get_credentials_from_db():
    with SessionLocal() as db:
        credentials = db.query(Credentials).filter(Credentials.custom_id == 1).first()
        if credentials:
            return credentials.host, credentials.username, credentials.password, credentials.port
        else:
            return None, None, None, None


class Config:
    RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST")
    RABBITMQ_PORT = int(os.environ.get("RABBITMQ_PORT"))
    RABBITMQ_USER = os.environ.get("RABBITMQ_USER")
    RABBITMQ_PASS = os.environ.get("RABBITMQ_PASS")
    
    @classmethod
    def get_rabbitmq_connection_parameters(cls):
        return pika.ConnectionParameters(
            host=cls.RABBITMQ_HOST,
            port=cls.RABBITMQ_PORT,
            credentials=pika.PlainCredentials(cls.RABBITMQ_USER, cls.RABBITMQ_PASS)
        )
    