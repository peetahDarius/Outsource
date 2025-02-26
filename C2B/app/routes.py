import json
from flask import Blueprint, jsonify, request
from .models import Credentials, db, C2B
from .mpesa import MpesaC2B

c2b_blueprint = Blueprint('c2b', __name__)

""" if you are using flask web framework, this is for you """
""" The following functions are hooks that will receive notifications from the mpesa daraja c2b api endpoint """
from flask import request


@c2b_blueprint.route("/credentials", methods=["GET", "POST"])
def add_delete_credentials():
    if request.method == "POST":
        data = request.get_json()
        consumer_key = data.get("consumer_key")
        consumer_secret = data.get("consumer_secret")
        confirmation_url = data.get("confirmation_url")
        validation_url = data.get("validation_url")
        short_code = data.get("short_code")
        command_id = data.get("command_id") 
        
        if not consumer_key:
            return jsonify({"detail": "consumer key is required"}), 400
        
        if not consumer_secret:
            return jsonify({"detail": "consumer secret is required"}), 400
        
        if not confirmation_url:
            return jsonify({"detail": "confirmation url is required"}), 400
        
        if not validation_url:
            return jsonify({"detail": "validation url is required"}), 400
        
        if not short_code:
            return jsonify({"detail": "short code is required"}), 400
        
        if not command_id:
            return jsonify({"detail": "command id is required"}), 400
        
        existing_credentials = Credentials.query.filter_by(custom_id=1).first()
        if existing_credentials:
            db.session.delete(existing_credentials)
            db.session.commit()
        
        credentials = Credentials(consumer_key=consumer_key, consumer_secret=consumer_secret, confirmation_url=confirmation_url, validation_url=validation_url, short_code=short_code, command_id=command_id)
        
        db.session.add(credentials)
        db.session.commit()
        
        response = {
            "consumer_key": consumer_key,
            "consumer_secret": consumer_secret,
            "confirmation_url": confirmation_url,
            "validation_url": validation_url,
            "short_code": short_code,
            "command_id": command_id
        }
        return jsonify(response), 201
    
    if request.method == "GET":
        credentials = Credentials.query.filter_by(custom_id=1).first()
        response = {
            "consumer_key": credentials.consumer_key,
            "consumer_secret": credentials.consumer_secret,
            "confirmation_url": credentials.confirmation_url,
            "validation_url": credentials.validation_url,
            "short_code": credentials.short_code,
            "command_id": credentials.command_id
        }
        
        return jsonify(response), 200


@c2b_blueprint.route("/confirm", methods=['POST'])
def confirm():
    # get data
    data = request.get_json()
    trans_id = data["TransID"]
    trans_time = data["TransTime"]
    amount = data["TransAmount"]
    msisdn = data["MSISDN"]
    first_name = data["FirstName"]
    middle_name = data["MiddleName"]
    last_name = data["LastName"]
    bill_ref_number = data["BillRefNumber"]
    org_acc_balance = data["OrgAccountBalance"]
    payment = C2B(trans_id=trans_id, trans_time=trans_time, amount=amount, msisdn=msisdn, first_name=first_name, middle_name=middle_name, last_name=last_name, bill_ref_number=bill_ref_number, org_acc_balance=org_acc_balance)
    db.session.add(payment)
    db.session.commit()
    
    return {
        "ResultCode": 0,
        "ResultDesc": "Accepted"
    }


@c2b_blueprint.route("/validate", methods=['POST'])
def validate():
    # get data
    data = request.get_json()
    # write to a file
    # file = open('validate.json', 'a')
    # file.write(json.dumps(data))
    # file.close()
    return {
        "ResultCode": 0,
        "ResultDesc": "Accepted"
    }

"""The register url function is used to register the url that will receive confirmation messages when a 
transaction has occurred """


@c2b_blueprint.route("/register", methods=["GET"])
def register_url():
    credentials = Credentials.query.filter_by(custom_id=1).first()
    consumer_key = credentials.consumer_key
    consumer_secret = credentials.consumer_secret
    confirmation_url = credentials.confirmation_url
    validation_url = credentials.validation_url
    business_short_code = credentials.short_code
    response_type = "Completed"  
    
    # authorization_url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    # register_url_endpoint = "https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl"

    mpesa_obj = MpesaC2B(consumer_key=consumer_key, consumer_secret=consumer_secret)
    
    # mpesa_obj.production_urls(authorization_url=authorization_url, register_urls_endpoint=register_url_endpoint)
    
    register_url_response = mpesa_obj.register_url(confirmation_endpoint=confirmation_url,
                                                   validation_endpoint=validation_url,
                                                   short_code=business_short_code,
                                                   response_type=response_type)
    return register_url_response


"""After registering your urls successfully in the sandbox, you can simulate the transaction using the simulate function
 below"""


@c2b_blueprint.route("/simulate", methods=["GET"])
def simulate():
    credentials = Credentials.query.filter_by(custom_id=1).first()
    consumer_key = credentials.consumer_key
    consumer_secret = credentials.consumer_secret
    amount = 1
    command_id = credentials.command_id
    bill_ref_no = "Testpay"
    phone_number = "254708374149"
    business_short_code = credentials.short_code

    mpesa_obj = MpesaC2B(consumer_key=consumer_key, consumer_secret=consumer_secret)
    mpesa_obj.short_code = business_short_code
    mpesa_obj_response = mpesa_obj.simulate_transaction(amount=amount,
                                                        command_id=command_id,
                                                        bill_ref_no=bill_ref_no,
                                                        msisdn=phone_number)
    return mpesa_obj_response


@c2b_blueprint.route("/payments", methods=["GET"])
def get_payments():
    payments = C2B.query.all()
    all_payments = []
    for payment in payments:
        payment_dict = {
            "id": payment.id,
            "trans_id": payment.trans_id,
            "trans_time": payment.trans_time,
            "amount": payment.amount,
            "msisdn": payment.msisdn,
            "first_name": payment.first_name,
            "bill_ref_number": payment.bill_ref_number
        }
        all_payments.append(payment_dict)
    return jsonify(all_payments), 200