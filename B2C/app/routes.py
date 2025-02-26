from flask import Blueprint, jsonify, request
from .models import Credentials, db, B2C
from .mpesa import MpesaB2C
from flask import request

b2c_blueprint = Blueprint('b2c', __name__)

@b2c_blueprint.route("/credentials", methods=["POST", "GET"])
def add_delete_credentials():
    if request.method == "POST":
        data = request.get_json()
        initiator_name = data.get("initiator_name")
        command_id = data.get("command_id")
        short_code = data.get("short_code")
        security_credential = data.get("security_credential")
        query_timeout_url = data.get("query_timeout_url")
        result_url = data.get("result_url")
        consumer_key = data.get("consumer_key")
        consumer_secret = data.get("consumer_secret")
        
        if not initiator_name:
            return jsonify({"detail": "initiator name is required"})
        
        if not command_id:
            return jsonify({"detail": "command_id is required"})
        
        if not short_code:
            return jsonify({"detail": "short_code is required"})
        
        if not security_credential:
            return jsonify({"detail": "security credential name is required"})
        
        if not query_timeout_url:
            return jsonify({"detail": "query_timeout_url is required"})
        
        if not result_url:
            return jsonify({"detail": "result_url is required"})
        
        if not consumer_key:
            return jsonify({"detail": "consumer_key is required"})
        
        if not consumer_secret:
            return jsonify({"detail": "consumer_secret is required"})   
        
        existing_credentials = Credentials.query.filter_by(custom_id=1).first()
        
        if existing_credentials:
            db.session.delete(existing_credentials)
            db.session.commit()
            
        credentials = Credentials(initiator_name=initiator_name, command_id=command_id, short_code=short_code, security_credential=security_credential, query_timeout_url=query_timeout_url, result_url=result_url, consumer_key=consumer_key, consumer_secret=consumer_secret)
        db.session.add(credentials)
        db.session.commit()
        
        return jsonify({data}), 201
        
    if request.method == "GET":
        credentials = Credentials.query.filter_by(custom_id=1).first()
        credentials_data = {
            "initiator_name": credentials.initiator_name,
            "command_id": credentials.command_id,
            "short_code": credentials.short_code,
            "security_credential": credentials.security_credential,
            "query_timeout_url": credentials.query_timeout_url, 
            "result_url": credentials.result_url, 
            "consumer_key": credentials.consumer_key, 
            "consumer_secret": credentials.consumer_secret
        }
        return jsonify(credentials_data), 200


@b2c_blueprint.route("/disburse", methods=["GET"])
def disburse():
    credentials = Credentials.query.filter_by(custom_id=1).first()
    originator_conversation_id = "hellooo1"
    initiator_name = credentials.initiator_name
    amount = 10
    command_id = credentials.command_id
    party_a = credentials.short_code
    party_b = "254708374149"
    remarks = "Work Payment"
    occasion = "a normal payment"
    security_credential = credentials.security_credential
    query_timeout_url = credentials.query_timeout_url
    result_url = credentials.result_url
    
    consumer_key = credentials.consumer_key
    consumer_secret = credentials.consumer_secret
    mpesa_obj = MpesaB2C(consumer_key=consumer_key, consumer_secret=consumer_secret)
    
    disburse_response = mpesa_obj.disburse(originator_conversation_id=originator_conversation_id, initiator_name=initiator_name, amount=amount, command_id=command_id, party_a=party_a, party_b=party_b, remarks=remarks, occasion=occasion, security_credential=security_credential, queue_timeout_url=query_timeout_url, result_url=result_url)
    
    print(disburse_response)
    return jsonify(), 201


@b2c_blueprint.route("/result", methods=["POST"])
def result_endpoint():
    # data = request.get_json()
    data = {'Result': {'ResultType': 0, 'ResultCode': 0, 'ResultDesc': 'The service request is processed successfully.', 'OriginatorConversationID': '721ff811-03b9-43f0-a1b8-f6398ae386df', 'ConversationID': 'AG_20250212_2010649923087df87f74', 'TransactionID': 'TBC82Q3LCO', 'ResultParameters': {'ResultParameter': [{'Key': 'TransactionAmount', 'Value': 10}, {'Key': 'TransactionReceipt', 'Value': 'TBC82Q3LCO'}, {'Key': 'ReceiverPartyPublicName', 'Value': '254708374149 - John Doe'}, {'Key': 'TransactionCompletedDateTime', 'Value': '12.02.2025 06:03:24'}, {'Key': 'B2CUtilityAccountAvailableFunds', 'Value': 8501925.94}, {'Key': 'B2CWorkingAccountAvailableFunds', 'Value': 17637.0}, {'Key': 'B2CRecipientIsRegisteredCustomer', 'Value': 'Y'}, {'Key': 'B2CChargesPaidAccountAvailableFunds', 'Value': -2695.0}]}, 'ReferenceData': {'ReferenceItem': {'Key': 'QueueTimeoutURL', 'Value': 'https://internalsandbox.safaricom.co.ke/mpesa/b2cresults/v1/submit'}}}}
    result_code = data["Result"]["ResultCode"]
    
    result_parameters = data['Result']["ResultParameters"]["ResultParameter"]
    if result_code == 0:
        new_dict = {}
        for result in result_parameters:
            key = result["Key"]
            value = result["Value"]
            print(key, value)
            item = {
                key: value
            }
            new_dict.update(item)
        
        amount = new_dict["TransactionAmount"]
        receipt = new_dict["TransactionReceipt"]
        receiver_party_public_name = new_dict["ReceiverPartyPublicName"]
        transaction_complete_datetime = new_dict["TransactionCompletedDateTime"]
        working_account_available_funds = new_dict["B2CWorkingAccountAvailableFunds"]
        
        payment_result = B2C(amount=amount, receipt=receipt, receiver_party_public_name=receiver_party_public_name, transaction_complete_datetime=transaction_complete_datetime, working_account_available_funds=working_account_available_funds)
        db.session.add(payment_result)
        db.session.commit()
        
    return jsonify(data), 201


@b2c_blueprint.route("/timeout", methods=["POST"])
def queue_timeout():
    data = request.get_json()
    print(data)
    return jsonify({}), 201