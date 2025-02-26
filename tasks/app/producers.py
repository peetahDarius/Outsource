import pika
from pika.exchange_type import ExchangeType
connection_parameters = pika.ConnectionParameters("localhost")


def process_client_queue(message):
    with pika.BlockingConnection(connection_parameters) as connection:
        channel = connection.channel()
        channel.exchange_declare(exchange="process_client", exchange_type=ExchangeType.direct)
        channel.basic_publish(exchange="process_client", routing_key="clients-backend", body=message)