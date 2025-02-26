from . import db
from datetime import datetime

class B2C(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    receipt = db.Column(db.String(200))
    transaction_complete_datetime = db.Column(db.String(200))
    amount = db.Column(db.Float)
    working_account_available_funds = db.Column(db.Float)
    receiver_party_public_name = db.Column(db.Text)
    created = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __str__(self):
        return self.receipt


class Credentials(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    consumer_key = db.Column(db.Text)
    consumer_secret = db.Column(db.Text)
    initiator_name = db.Column(db.Text)
    security_credential = db.Column(db.Text)
    query_timeout_url = db.Column(db.Text)
    result_url = db.Column(db.Text)
    short_code = db.Column(db.String(50))
    command_id = db.Column(db.Text)
    custom_id = db.Column(db.Integer, default=1)
    
    def __str__(self):
        return self.short_code