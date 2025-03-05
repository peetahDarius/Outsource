from app import create_app
from app.consumers import process_client_queue_consumer, task_scheduled_queue_consumer
import threading

app = create_app()

if __name__ == "__main__":
    process_client_consumer_thread = threading.Thread(target=process_client_queue_consumer, daemon=True)
    process_client_consumer_thread.start()
    
    task_scheduled_consumer_thread = threading.Thread(target=task_scheduled_queue_consumer, daemon=True)
    task_scheduled_consumer_thread.start()
    app.run(host="0.0.0.0", port="5000")
