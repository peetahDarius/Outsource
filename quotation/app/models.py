from . import db
from datetime import datetime

class Credentials(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    custom_id = db.Column(db.Integer, default=1)
    name = db.Column(db.String(250))
    address = db.Column(db.String(250))
    email = db.Column(db.String(254))
    website = db.Column(db.String(254))
    bank_name = db.Column(db.String(254), default="mpesa")
    paybill_number = db.Column(db.String(254))
    phone = db.Column(db.String(250))
    prefix = db.Column(db.String(10))
    created = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return self.paybill_number