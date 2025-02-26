from . import db
from datetime import datetime

class Disburse(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    task_id = db.Column(db.Text)
    engineer_task_id = db.Column(db.Text)
    amount = db.Column(db.Integer)
    engineer_id = db.Column(db.Integer, default=0)
    status = db.Column(db.String(200), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)