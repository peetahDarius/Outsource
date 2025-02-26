from . import db
from datetime import datetime

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.Text)
    client_id = db.Column(db.Integer)
    quotation_id = db.Column(db.String(200))
    total_amount = db.Column(db.Integer)
    paid_amount = db.Column(db.Integer, default=0)
    engineers = db.Column(db.JSON)
    status = db.Column(db.String(200), default="created")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)