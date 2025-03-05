from app import create_app
import threading
from app.consumers import task_scheduled_queue_consumer

app = create_app()

if __name__ == "__main__":
    task_scheduled_consumer = threading.Thread(target=task_scheduled_queue_consumer, daemon=True)
    task_scheduled_consumer.start()
    app.run(debug=True, host="0.0.0.0", port=5000)
