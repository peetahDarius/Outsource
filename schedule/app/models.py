from . import db
from datetime import datetime

class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    task_id = db.Column(db.Text)
    all_day = db.Column(db.Boolean)
    start = db.Column(db.Text)
    end = db.Column(db.Text)
    title = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)