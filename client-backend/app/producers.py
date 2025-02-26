import pika
from pika.exchange_type import ExchangeType
connection_parameters = pika.ConnectionParameters("localhost")


def task_scheduled_queue(message):
    with pika.BlockingConnection(connection_parameters) as connection:
        channel = connection.channel()
        channel.exchange_declare(exchange="task_scheduled_notify", exchange_type=ExchangeType.fanout)
        channel.basic_publish(exchange="task_scheduled_notify", routing_key="", body=message)