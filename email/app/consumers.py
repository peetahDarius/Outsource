import json
import pika
from pika.exchange_type import ExchangeType
from fastapi import BackgroundTasks
from .mailer import send_mail

connection_parameters = pika.ConnectionParameters("localhost")

""" ============================= Task scheduled ========================================"""

def on_task_scheduled_message_received(ch, method, properties, body):
    data = json.loads(body)
    task_details = data.get("task_details")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    
    message = f"""
        Greetings,
       Your job {task_details["id"]} has been scheduled for {task_details["start"]} to {task_details["end"]}.
       
       Thank you.
    """
    
    email_dict = {
        "to": email,
        "subject": f"Schedule for task {task_details['id']}",
        "body": message
    }
    
    send_mail(email_dict, None)
    
    ch.basic_ack(delivery_tag=method.delivery_tag)
    
def task_scheduled_notify_queue_consumer():
    connection = pika.BlockingConnection(connection_parameters)
    channel = connection.channel()
    channel.exchange_declare(exchange="task_scheduled_notify", exchange_type=ExchangeType.fanout)
    queue = channel.queue_declare(queue="", exclusive=True)
    
    channel.queue_bind(exchange="task_scheduled_notify", queue=queue.method.queue)
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=queue.method.queue, on_message_callback=on_task_scheduled_message_received)
    channel.start_consuming()
