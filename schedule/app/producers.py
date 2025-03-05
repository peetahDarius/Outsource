import pika
from pika.exchange_type import ExchangeType
from .config import Config

connection_parameters = Config.get_rabbitmq_connection_parameters()

def task_scheduled_queue(message):
    with pika.BlockingConnection(connection_parameters) as connection:
        channel = connection.channel()
        channel.exchange_declare(exchange="task_scheduled", exchange_type=ExchangeType.fanout)
        channel.basic_publish(exchange="task_scheduled", routing_key="", body=message)