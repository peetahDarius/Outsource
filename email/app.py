import uvicorn
import threading
from app.consumers import task_scheduled_notify_queue_consumer

if __name__ == "__main__":
    task_scheduled_notify_consumer = threading.Thread(target=task_scheduled_notify_queue_consumer, daemon=True)
    task_scheduled_notify_consumer.start()
    uvicorn.run("app.main:app", host="127.0.0.1", reload=True, port=8080)