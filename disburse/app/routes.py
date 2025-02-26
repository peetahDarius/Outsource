from flask import Blueprint, jsonify, request
from .models import db, Disburse

disburse_blueprint = Blueprint('disburse', __name__)

@disburse_blueprint.route("/", methods=["POST", "GET"])
def list_create_disburse_payment():
    if request.method == "POST":
        data = request.get_json()
        task_id = data.get("task_id")
        engineer_task_id = data.get("engineer_task_id")
        amount = data.get("amount")
        engineer_id = data.get("engineer_id")
        
        
        if not task_id:
            return jsonify({"detail": "task_id is required"}), 400
        
        if not engineer_id:
            return jsonify({"detail": "engineer_id is required"}), 400
        
        if not engineer_task_id:
            return jsonify({"detail": "engineer_task_id is required"}), 400
        
        if not amount:
            return jsonify({"detail": "amount is required"}), 400
        
        uncoupled_engineer_task_id = engineer_task_id.split("-")
        
        print(uncoupled_engineer_task_id[1], engineer_id)
        
        if task_id != uncoupled_engineer_task_id[0]:
            return jsonify({"detail": "invalid engineer_task_id or task_id"}), 400
        
        print(int(uncoupled_engineer_task_id[1]), int(engineer_id))
        if int(engineer_id) != int(uncoupled_engineer_task_id[1]):
            return jsonify({"detail": "invalid engineer_task_id or engineer_id"}), 400
        
        disburse_data = Disburse(task_id=task_id, engineer_task_id=engineer_task_id, amount=amount, engineer_id=engineer_id)
        
        # add event to actually disburse the money
        
        db.session.add(disburse_data)
        db.session.commit()
        
        return jsonify(data), 201
        
    if request.method == "GET":
        disburse_data = Disburse.query.all()
        disburse_list = []
        for data in disburse_data:
            disburse_dict = {
                "id": data.id,
                "task_id": data.task_id,
                "engineer_task_id": data.engineer_task_id,
                "amount": data.amount,
                "engineer_id": data.engineer_id,
                "status": data.status,
                "created_at": data.created_at,
                "updated_at": data.updated_at
            }
            disburse_list.append(disburse_dict)
            
        return jsonify(disburse_list), 200
    

@disburse_blueprint.route("/task/<string:task_id>/", methods=["GET"])
def get_tasks_disbursements(task_id):
    disburse_data = Disburse.query.filter_by(task_id=task_id).all()
    disburse_list = []
    total_amount = 0
    for data in disburse_data:
        total_amount += data.amount
        disburse_dict = {
            "id": data.id,
            "task_id": data.task_id,
            "engineer_task_id": data.engineer_task_id,
            "amount": data.amount,
            "engineer_id": data.engineer_id,
            "status": data.status,
            "created_at": data.created_at,
            "updated_at": data.updated_at
        }
        disburse_list.append(disburse_dict)
        
    total_data = {
        "total_amount": total_amount,
        "disbursements": disburse_list
    }
        
    return jsonify(total_data), 200


@disburse_blueprint.route("/task-per-eng/<string:task_id>/", methods=["GET"])
def get_tasks_disbursements_per_engineer(task_id):
    disburse_data = Disburse.query.filter_by(task_id=task_id).all()
    
    total_amount = 0
    engineers = []
    
    for data in disburse_data:
        total_amount += data.amount
        if data.engineer_task_id not in engineers:
            engineers.append(data.engineer_task_id)
    
    engineer_dict = {"total": total_amount}       
    for engineer in engineers:
        total = 0
        
        all_disbursements = Disburse.query.filter_by(engineer_task_id=engineer).all()
        for disbursement in all_disbursements:
            total += disbursement.amount
        engineer_dict.update({engineer: total})
    
    return jsonify(engineer_dict), 200

@disburse_blueprint.route("/engineer-task/<string:engineer_task_id>/", methods=["GET"])
def get_engineer_tasks_disbursements(engineer_task_id):
    disburse_data = Disburse.query.filter_by(engineer_task_id=engineer_task_id).all()
    disburse_list = []
    total_amount = 0
    for data in disburse_data:
        total_amount += data.amount
        disburse_dict = {
            "id": data.id,
            "task_id": data.task_id,
            "engineer_task_id": data.engineer_task_id,
            "amount": data.amount,
            "engineer_id": data.engineer_id,
            "status": data.status,
            "created_at": data.created_at,
            "updated_at": data.updated_at
        }
        disburse_list.append(disburse_dict)
    
    total_data = {
        "total_amount": total_amount,
        "disbursements": disburse_list
    }
        
    return jsonify(total_data), 200