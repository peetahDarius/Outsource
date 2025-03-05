import json
import pika
from pika.exchange_type import ExchangeType
from .models import db, Client
from app import create_app 
from .producers import task_scheduled_queue
from .config import Config

connection_parameters = Config.get_rabbitmq_connection_parameters()

def on_process_client_message_received(ch, method, properties, body):
    data = json.loads(body)
    client_id = data.get("client_id")
    
    client = Client.query.filter_by(id=client_id).first()
    client.status = "processed"
    db.session.commit()
    ch.basic_ack(delivery_tag=method.delivery_tag)

def process_client_queue_consumer():
    app = create_app()
    
    with app.app_context():
        connection = pika.BlockingConnection(connection_parameters)
        channel = connection.channel()
        channel.exchange_declare(exchange="process_client", exchange_type=ExchangeType.direct)
        queue = channel.queue_declare(queue="", exclusive=True)
        
        channel.queue_bind(exchange="process_client", queue=queue.method.queue, routing_key="clients-backend")
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue=queue.method.queue, on_message_callback=on_process_client_message_received)
        channel.start_consuming()
    


""" ============================= Task scheduled ========================================"""

def on_task_scheduled_message_received(ch, method, properties, body):
    data = json.loads(body)
    client_id = data["extendedProps"]["task"]["client_id"]
    
    client = Client.query.filter_by(id=client_id).first()
    phone = client.phone
    email = client.email
    first_name = client.first_name
    last_name = client.last_name
    
    message = {
            "first_name": first_name,
            "last_name": last_name,
            "phone": phone,
            "email": email,
            "task_details": data
            }
    
    task_scheduled_queue(json.dumps(message))
    
    ch.basic_ack(delivery_tag=method.delivery_tag)
    
def task_scheduled_queue_consumer():
    app = create_app()
    
    with app.app_context():
        connection = pika.BlockingConnection(connection_parameters)
        channel = connection.channel()
        channel.exchange_declare(exchange="task_scheduled", exchange_type=ExchangeType.fanout)
        queue = channel.queue_declare(queue="", exclusive=True)
        
        channel.queue_bind(exchange="task_scheduled", queue=queue.method.queue)
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue=queue.method.queue, on_message_callback=on_task_scheduled_message_received)
        channel.start_consuming()
    