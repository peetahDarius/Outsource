from . import db
from datetime import datetime

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    first_name = db.Column(db.String(200))
    last_name = db.Column(db.String(200))
    longitude = db.Column(db.String(254), nullable=True)
    latitude = db.Column(db.String(254), nullable=True)
    email = db.Column(db.String(254))
    phone = db.Column(db.String(50))
    message = db.Column(db.Text)
    status = db.Column(db.String(100), default="pending")
    created = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"{self.sender_id}"