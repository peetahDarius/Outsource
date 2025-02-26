from . import db
from datetime import datetime

class SMS(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(200))
    message = db.Column(db.Text)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"{self.message[:50]}"


class Credentials(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(200))
    sender_id = db.Column(db.String(200))
    password = db.Column(db.String(254))
    created = db.Column(db.DateTime, default=datetime.utcnow)
    active = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f"{self.sender_id}"