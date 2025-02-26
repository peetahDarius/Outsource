from flask import Blueprint, jsonify, request
from .models import Credentials, db

quotation_blueprint = Blueprint('quotation', __name__)

@quotation_blueprint.route("/credentials/", methods=["POST", "GET", "DELETE"])
def list_create_credentials():
    if request.method == "POST":
        data = request.get_json()
        name = data.get("name")
        phone = data.get("phone")
        prefix = data.get("prefix")
        address = data.get("address")
        email = data.get("email")
        website = data.get("website")
        bank_name = data.get("bank_name")
        paybill_number = data.get("paybill_number")
        
        if not name:
            return jsonify({"detail": "name is required"}), 400
        
        if not address:
            return jsonify({"detail": "address is required"}), 400
        
        if not email:
            return jsonify({"detail": "email is required"}), 400
        
        if not website:
            return jsonify({"detail": "website is required"}), 400
        
        if not paybill_number:
            return jsonify({"detail": "paybill number is required"}), 400
        
        if not phone:
            return jsonify({"detail": "phone number is required"}), 400
        
        if not prefix:
            return jsonify({"detail": "prefix is required"}), 400
        
        existing_credentials = Credentials.query.filter_by(custom_id = 1).first()
        if existing_credentials:
            db.session.delete(existing_credentials)
            db.session.commit()
        
        credentials = Credentials(name=name, address=address, email=email, website=website, bank_name=bank_name, paybill_number=paybill_number, phone=phone, prefix=prefix)
        db.session.add(credentials)
        db.session.commit()
        return jsonify(data), 201
        
    if request.method == "GET":
        credentials = Credentials.query.filter_by(custom_id=1).first()
        if not credentials:
            return jsonify({}), 200
        
        credential_dict = {
            "name": credentials.name,
            "address": credentials.address,
            "email": credentials.email,
            "website": credentials.website,
            "bank_name": credentials.bank_name,
            "paybill_number": credentials.paybill_number,
            "phone": credentials.phone,
            "prefix": credentials.prefix
        }
        return jsonify(credential_dict), 200
    
    if request.method == "DELETE":
        credentials = Credentials.query.all()
        
        for credential in credentials:
            db.session.delete(credential)
        
        db.session.commit()
        return jsonify({}), 204