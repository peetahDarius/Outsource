import os
from dotenv import load_dotenv
import pika

load_dotenv()


class Config:
    TASK_DATABASE_USERNAME = os.environ.get("TASK_DATABASE_USERNAME")
    TASK_DATABASE_PASSWORD = os.environ.get("TASK_DATABASE_PASSWORD")
    TASK_DATABASE_HOST = os.environ.get("TASK_DATABASE_HOST")
    TASK_DATABASE_PORT = os.environ.get("TASK_DATABASE_PORT")
    TASK_DATABASE_NAME = os.environ.get("TASK_DATABASE_NAME")

    RABBITMQ_HOST = os.environ.get("RABBITMQ_HOST")
    RABBITMQ_PORT = int(os.environ.get("RABBITMQ_PORT"))
    RABBITMQ_USER = os.environ.get("RABBITMQ_DEFAULT_USER")
    RABBITMQ_PASS = os.environ.get("RABBITMQ_DEFAULT_PASS")

    SQLALCHEMY_DATABASE_URI = f'postgresql+psycopg2://{TASK_DATABASE_USERNAME}:{TASK_DATABASE_PASSWORD}@{TASK_DATABASE_HOST}:{TASK_DATABASE_PORT}/{TASK_DATABASE_NAME}?sslmode=disable'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get("SECRET_KEY", "your_secret_key")
    
    @classmethod
    def get_rabbitmq_connection_parameters(cls):
        return pika.ConnectionParameters(
            host=cls.RABBITMQ_HOST,
            port=cls.RABBITMQ_PORT,
            credentials=pika.PlainCredentials(cls.RABBITMQ_USER, cls.RABBITMQ_PASS)
        )
    