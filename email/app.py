import uvicorn
import threading
from app.consumers import task_scheduled_notify_queue_consumer
from app.database import engine, Base
from app.models import Credentials

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Database tables created.")

if __name__ == "__main__":
    task_scheduled_notify_consumer = threading.Thread(target=task_scheduled_notify_queue_consumer, daemon=True)
    task_scheduled_notify_consumer.start()
    uvicorn.run("app.main:app", host="0.0.0.0", reload=True, port=8000)