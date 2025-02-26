from flask import Blueprint, jsonify, request
from .models import db, Client

client_blueprint = Blueprint('client', __name__)

@client_blueprint.route("/", methods=["POST", "GET"])
def list_create_client():
    if request.method == "POST":
        data = request.get_json()
        
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        email = data.get("email")
        phone = data.get("phone")
        longitude = data.get("longitude")
        latitude = data.get("latitude")
        message = data.get("message")
        
        if not first_name:
            return jsonify({"detail": "first_name is required"}), 400
        
        if not last_name:
            return jsonify({"detail": "last_name is required"}), 400
        
        if not email:
            return jsonify({"detail": "email is required"}), 400
        
        if not phone:
            return jsonify({"detail": "phone is required"}), 400
        
        if not message:
            return jsonify({"detail": "message is required"}), 400
        
        client_data = Client(first_name=first_name, last_name=last_name, email=email, phone=phone, longitude=longitude, latitude=latitude, message=message)
        
        db.session.add(client_data)
        db.session.commit()
        
        response = {
            "detail": "success",
            "first_name": first_name,
            "last_name": last_name,
            "phone": phone,
            "email": email,
            "message": message,
            "coordinates": {
                "longitude": longitude,
                "latitude": latitude
            },
            "status": "pending"
        }
        return jsonify(response), 201
        
    if request.method == "GET":
        clients = Client.query.all()
        
        all_clients = []
        for client in clients:
            client_data = {
            "id": client.id,
            "first_name": client.first_name,
            "last_name": client.last_name,
            "phone": client.phone,
            "email": client.email,
            "message": client.message,
            "coordinates": {
                "longitude": client.longitude,
                "latitude": client.latitude
            },
            "status": client.status
        }
            
            all_clients.append(client_data)
            
        return jsonify(all_clients), 200
    

@client_blueprint.route("/pending", methods={"GET"})
def pending_clients():
    clients = Client.query.filter_by(status="pending").all()
        
    all_clients = []
    for client in clients:
        client_data = {
        "id": client.id,
        "first_name": client.first_name,
        "last_name": client.last_name,
        "phone": client.phone,
        "email": client.email,
        "message": client.message,
        "coordinates": {
            "longitude": client.longitude,
            "latitude": client.latitude
        },
        "status": client.status
    }
        
        all_clients.append(client_data)
        
    return jsonify(all_clients), 200

@client_blueprint.route("/<int:pk>/", methods=["GET", "DELETE"])
def retrieve_delete_client(pk):
    if request.method == "GET":
        client = Client.query.filter_by(id=pk).first()
        if not client:
            return jsonify({"detail": f"client with id {pk} not found"}), 404
        
        client_data = {
            "id": client.id,
            "first_name": client.first_name,
            "last_name": client.last_name,
            "phone": client.phone,
            "email": client.email,
            "message": client.message,
            "coordinates": {
                "longitude": client.longitude,
                "latitude": client.latitude
            },
            "status": client.status
        }
        return jsonify(client_data), 200
    
    if request.method == "DELETE":
        client = Client.query.filter_by(id=pk).first()
        if not client:
            return jsonify({"detail": f"client with id {pk} not found"}), 404
        
        db.session.delete(client)
        db.session.commit()
        
        return jsonify({}), 204