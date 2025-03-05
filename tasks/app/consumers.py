import json
import pika
from pika.exchange_type import ExchangeType
from .models import db, Task
from app import create_app 
from .config import Config

connection_parameters = Config.get_rabbitmq_connection_parameters()

def on_message_received(ch, method, properties, body):
    data = json.loads(body)
    quotation_id = data.get("id")
    task = Task.query.filter_by(quotation_id=quotation_id).first()
    task.status = "scheduled"
    db.session.commit()
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
        channel.basic_consume(queue=queue.method.queue, on_message_callback=on_message_received)
        channel.start_consuming()
    
