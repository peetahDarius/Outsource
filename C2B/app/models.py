from . import db
from datetime import datetime

class C2B(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    trans_id = db.Column(db.String(200))
    trans_time = db.Column(db.String(200))
    amount = db.Column(db.Float)
    msisdn = db.Column(db.String(200))
    first_name = db.Column(db.String(200))
    middle_name = db.Column(db.String(200))
    last_name = db.Column(db.String(200))
    org_acc_balance = db.Column(db.Float)
    bill_ref_number = db.Column(db.String(255))
    created = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __str__(self):
        return self.bill_ref_number


class Credentials(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    consumer_key = db.Column(db.Text)
    consumer_secret = db.Column(db.Text)
    confirmation_url = db.Column(db.Text)
    validation_url = db.Column(db.Text)
    short_code = db.Column(db.String(50))
    command_id = db.Column(db.Text)
    custom_id = db.Column(db.Integer, default=1)
    
    def __str__(self):
        return self.short_code