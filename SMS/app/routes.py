from flask import Blueprint, jsonify, request
from .models import Credentials, db, SMS

sms_blueprint = Blueprint('SMS', __name__)


@sms_blueprint.route("/", methods=["GET", "POST"])
def create_list_sms():
    if request.method == "POST":
        data = request.get_json()
        message = data.get("message")
        recipient_list = data.get("recipient_list", [])
        
        if not message:
            return jsonify({"message": "message is required"}), 400
        
        if len(recipient_list) == 0:
            return jsonify({"message": "recipients cannot be less than 1"}), 400
        
        sent_status = send_sms(recipient_list=recipient_list, message=message)
        return jsonify(sent_status), 201
    else:
        smses = SMS.query.all()
        sms_list = []
        
        for sms in smses:
            sms_dict = {
                "id": sms.id,
                "message": sms.message,
                "recipient": sms.phone
            }
            sms_list.append(sms_dict)
        return jsonify(sms_list), 200
    
    
def send_sms(recipient_list, message):
    message_count = {
        "successful_messages_count": 0,
        "unsuccessful_messages_count": 0,
        "successful_messages": [],
        "unsuccessful_messages": [],
    }
    for recipient in recipient_list:
        # the code for sending the smses
        # the response should tell us if the smses were sent successfully
        response = print() # we assume print is the function
        
        if response.status == "success":
            message_count["successful_messages_count"] += 1
            message_count["successful_messages"].append(response.phone)
            sms = SMS(message=message, recipient=recipient)
            db.session.add(sms)
            db.session.commit()
        else:
            message_count["unsuccessful_messages_count"] += 1
            message_count["unsuccessful_messages"].append(response.phone)
    
    return message_count


@sms_blueprint.route('/credentials/', methods=["POST", "GET"])
def list_create_sms_credentials():
    if request.method == "POST":
        data = request.get_json()
        
        user_id = data.get("user_id")
        sender_id = data.get("sender_id")
        password = data.get("password")
        active = data.get("active")
        
        if not user_id:
            return jsonify({"detail": f"user_id is required"}), 400
        
        if not sender_id:
            return jsonify({"detail": "sender_id is required"}), 400
        
        if not password:
            return jsonify({"detail": "password is required"}), 400
        
        if active == True:
            active_credentials = Credentials.query.filter_by(active=True).first()
        
            if active_credentials:
                return jsonify({"detail": "disable the active configuration first"}), 400
        
        credentials = Credentials(user_id=user_id, sender_id=sender_id, password=password)
        
        db.session.add(credentials)
        db.session.commit()
        
        response = {
            "detail": "success",
            "user_id": user_id,
            "sender_id": sender_id,
            "password": password,
            "active": active
        }
        return jsonify(response), 201
    
    if request.method == "GET":
        all_credentials = Credentials.query.all()
        credentials = []
        for credential in all_credentials:
            credential_dict = {
                "id": credential.id,
                "user_id": credential.user_id,
                "sender_id": credential.sender_id,
                "password": credential.password,
                "active": credential.active
            }
            credentials.append(credential_dict)
        
        return jsonify(credentials), 200

@sms_blueprint.route('/credentials/<int:pk>', methods=["GET", "PUT", "DELETE"])
def get_sms_credentials(pk):
    if request.method == "GET":
        data = request.get_json()

        existing_credentials = Credentials.query.filter_by(id=pk).first()
        
        if not existing_credentials:
            return jsonify({"detail": f"credentials with id {pk} not found"})
        
        response = {
            "user_id": existing_credentials.user_id,
            "sender_id": existing_credentials.sender_id,
            "password": existing_credentials.password,
            "active": existing_credentials.active
        }
        return jsonify(response), 200
    
    if request.method == "PUT":
        data = request.get_json()
        
        user_id = data.get("user_id")
        sender_id = data.get("sender_id")
        password = data.get("password")
        active = data.get("active")
        
        existing_credentials = Credentials.query.filter_by(id=pk).first()
        
        if not existing_credentials:
            return jsonify({"detail": f"credentials with id {pk} not found"})
        
        if not user_id:
            return jsonify({"detail": f"user_id is required"}), 400
        
        if not sender_id:
            return jsonify({"detail": "sender_id is required"}), 400
        
        if not password:
            return jsonify({"detail": "password is required"}), 400
        
        if active == True:
            active_credentials = SMS.query.filter_by(active=True).first()
        
            if active_credentials:
                return jsonify({"detail": "disable the active configuration first"}), 400
        
        existing_credentials.user_id = user_id
        existing_credentials.sender_id = sender_id
        existing_credentials.active = active
        existing_credentials.password = password
        
        existing_credentials.save()
        db.session.commit()
        
        response = {
            "detail": "success",
            "user_id": user_id,
            "sender_id": sender_id,
            "password": password,
            "active": active
        }
        return jsonify(response), 202
    
    if request.method == "DELETE":
        data = request.get_json()

        existing_credentials = Credentials.query.filter_by(id=pk).first()
        
        if not existing_credentials:
            return jsonify({"detail": f"credentials with id {pk} not found"})
        
        db.session.delete(existing_credentials)
        db.session.commit()
        
        return jsonify({}), 204