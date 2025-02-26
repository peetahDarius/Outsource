import json
from flask import Blueprint, jsonify, request
from sqlalchemy import false
from .models import db, Schedule
from .producers import task_scheduled_queue

schedule_blueprint = Blueprint('schedule', __name__)

@schedule_blueprint.route("/", methods=["POST", "GET"])
def list_create_schedule():
    if request.method == "POST":
        data = request.get_json()
        task_id = data.get("id")
        all_day = data.get("allDay")
        start = data.get("start")
        end = data.get("end")
        title = data.get("title")
        
        if not task_id:
            return jsonify({"detail": "id is required"}), 400
        
        if all_day == "":
            return jsonify({"detail": "allDay is required"}), 400
        
        if not start:
            return jsonify({"detail": "start is required"}), 400
        
        if not end:
            return jsonify({"detail": "end is required"}), 400
        
        if not title:
            return jsonify({"detail": "title is required"}), 400
        
        existing_schedule = Schedule.query.filter_by(task_id=task_id).first()
        if existing_schedule:
            return jsonify({"detail": f"schedule with id {task_id} already exists"}), 409
        
        schedule = Schedule(task_id=task_id, all_day=all_day, start=start, end=end, title=title)
        db.session.add(schedule)
        db.session.commit()
        
        task_scheduled_queue(json.dumps(data))
        return jsonify(data), 201
        
    if request.method == "GET":
        schedules = Schedule.query.all()
        
        all_schedules = []
        
        for schedule in schedules:
            schedule_dict = {
                "id": schedule.task_id,
                "allDay": schedule.all_day,
                "start": schedule.start,
                "end": schedule.end,
                "title": schedule.title
            }
            
            all_schedules.append(schedule_dict)
            
        return jsonify(all_schedules), 200
    

@schedule_blueprint.route("/<string:id>/", methods=["DELETE", "GET", "PUT"])
def retrieve_update_delete_schedule(id):
    if request.method == "GET":
        schedule = Schedule.query.filter_by(task_id=id).first()
        
        schedule_dict = {
            "id": schedule.task_id,
            "allDay": schedule.all_day,
            "start": schedule.start,
            "end": schedule.end,
            "title": schedule.title
        }
        
        return jsonify(schedule_dict), 200
    
    if request.method == "PUT":
        data = request.get_json()
        task_id = data.get("id")
        all_day = data.get("allDay")
        start = data.get("start")
        end = data.get("end")
        title = data.get("title")
        
        
        if not task_id:
            return jsonify({"detail": "id is required"}), 400
        
        if all_day == "":
            return jsonify({"detail": "allDay is required"}), 400
        
        if not start:
            return jsonify({"detail": "start is required"}), 400
        
        if not end:
            return jsonify({"detail": "end is required"}), 400
        
        if not title:
            return jsonify({"detail": "title is required"}), 400
        
        existing_schedule = Schedule.query.filter_by(task_id=task_id).first()
        if not existing_schedule:
            return jsonify({"detail": f"schedule with id {task_id} does not exist"}), 404
        
        existing_schedule.task_id = task_id
        existing_schedule.all_day = all_day
        existing_schedule.start = start
        existing_schedule.end = end
        existing_schedule.title = title

        db.session.commit()
        
        return jsonify(data), 201
    
    if request.method == "DELETE":
        schedule = Schedule.query.filter_by(task_id=id).first()
        
        if not schedule:
            return jsonify({"detail": f"schedule {id} not found"}), 404
        
        db.session.delete(schedule)
        db.session.commit()
        
        return jsonify({}), 204