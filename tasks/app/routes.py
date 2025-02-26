import json
from flask import Blueprint, jsonify, request
from .models import db, Task
from .producers import process_client_queue

tasks_blueprint = Blueprint('tasks', __name__)

@tasks_blueprint.route("/", methods=["POST", "GET"])
def list_add_tasks():
    if request.method == "POST":
        data = request.get_json()
        name = data.get("name")
        client_id = data.get("client_id")
        quotation_id = data.get("quotation_id")
        total_amount = data.get("total_amount")
        engineers = data.get("engineers", [])
        
        if not name:
            return jsonify({"detail": "name is required"})
        
        if not client_id:
            return jsonify({"detail": "client_id is required"})
        
        if not quotation_id:
            return jsonify({"detail": "quotation_id is required"})
        
        if not total_amount:
            return jsonify({"detail": "total_amount is required"})
        
        if not engineers:
            return jsonify({"detail": "engineers list is required"})
        
        task = Task(name=name, client_id=client_id, quotation_id=quotation_id, total_amount=total_amount, engineers=engineers)
        
        db.session.add(task)
        db.session.commit()
        
        process_client_queue(json.dumps(data))
        
        return jsonify(data), 201
    
    if request.method == "GET":
        tasks = Task.query.all()
        all_tasks = []
        for task in tasks:
            task_dict = {
                "id": task.id,
                "name": task.name,
                "client_id": task.client_id,
                "quotation_id": task.quotation_id,
                "total_amount": task.total_amount,
                "paid_amount": task.paid_amount,
                "engineers": task.engineers,
                "status": task.status,
                "created_at": task.created_at,
                "updated_at": task.updated_at
            }
            all_tasks.append(task_dict)
            
        return jsonify(all_tasks), 200
    
    
@tasks_blueprint.route("/<int:pk>", methods=["GET", "PUT", "DELETE"])
def retrieve_update_delete_tasks(pk:int):
    if request.method == "GET":
        task = Task.query.filter_by(id=pk).first()
        if not task:
            return jsonify({"detail": f"task with id {pk} not found"}), 404
        
        task_dict = {
                "id": task.id,
                "name": task.name,
                "client_id": task.client_id,
                "quotation_id": task.quotation_id,
                "total_amount": task.total_amount,
                "paid_amount": task.paid_amount,
                "engineers": task.engineers,
                "status": task.status,
                "created_at": task.created_at,
                "updated_at": task.updated_at
            }
        return jsonify(task_dict), 200
    
    if request.method == "PUT":
        
        data = request.get_json()
        name = data.get("name")
        client_id = data.get("client_id")
        quotation_id = data.get("quotation_id")
        total_amount = data.get("total_amount")
        engineers = data.get("engineers", [])
        
        if not name:
            return jsonify({"detail": "name is required"})
        
        if not client_id:
            return jsonify({"detail": "client_id is required"})
        
        if not quotation_id:
            return jsonify({"detail": "quotation_id is required"})
        
        if not total_amount:
            return jsonify({"detail": "total_amount is required"})
        
        if not engineers:
            return jsonify({"detail": "engineers list is required"})
        
        task = Task.query.filter_by(id=pk).first()
        if not task:
            return jsonify({"detail": f"task with id {pk} not found"}), 404
        
        task.name = name
        task.client_id = client_id
        task.quotation_id = quotation_id
        task.total_amount = total_amount
        task.engineers = engineers
        
        db.session.commit()
        
        task_dict = {
                "id": task.id,
                "name": task.name,
                "client_id": task.client_id,
                "quotation_id": task.quotation_id,
                "total_amount": task.total_amount,
                "paid_amoubt": task.paid_amount,
                "engineers": task.engineers,
                "status": task.status,
                "created_at": task.created_at,
                "updated_at": task.updated_at
            }
        
        return jsonify(task_dict), 202
         
    if request.method == "DELETE":
        task = Task.query.filter_by(id=pk).first()
        if not task:
            return jsonify({"detail": f"task with id {pk} not found"}), 404
        
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({}), 204
    

@tasks_blueprint.route("/unscheduled/", methods=["GET"])
def unscheduled_tasks():
    tasks = Task.query.filter_by(status="created").all()
    all_tasks = []
    
    for task in tasks:
        task_dict = {
            "id": task.id,
            "name": task.name,
            "client_id": task.client_id,
            "quotation_id": task.quotation_id,
            "total_amount": task.total_amount,
            "paid_amount": task.paid_amount,
            "engineers": task.engineers,
            "status": task.status,
            "created_at": task.created_at,
            "updated_at": task.updated_at
        }
        all_tasks.append(task_dict)
    
    return jsonify(all_tasks), 200