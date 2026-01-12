"""
Container Routes
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.container import Container
from app.models.sensor_data import SensorData

containers_bp = Blueprint('containers', __name__)


@containers_bp.route('', methods=['GET'])
@jwt_required()
def get_containers():
    """Get all containers for current user"""
    current_user_id = get_jwt_identity()
    containers = Container.query.filter_by(user_id=current_user_id).all()
    
    return jsonify({
        'containers': [c.to_dict() for c in containers]
    }), 200


@containers_bp.route('/<int:container_id>', methods=['GET'])
@jwt_required()
def get_container(container_id):
    """Get single container by ID"""
    current_user_id = get_jwt_identity()
    container = Container.query.filter_by(
        id=container_id, 
        user_id=current_user_id
    ).first()
    
    if not container:
        return jsonify({'error': 'Container not found'}), 404
    
    return jsonify({
        'container': container.to_dict()
    }), 200


@containers_bp.route('', methods=['POST'])
@jwt_required()
def create_container():
    """Create a new container"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not data.get('device_id') or not data.get('name'):
        return jsonify({'error': 'device_id and name are required'}), 400
    
    # Check if device_id already exists
    if Container.query.filter_by(device_id=data['device_id']).first():
        return jsonify({'error': 'Device ID already registered'}), 409
    
    container = Container(
        device_id=data['device_id'],
        name=data['name'],
        user_id=current_user_id,
        capacity=data.get('capacity', 20.0),
        height=data.get('height', 40.0),
        diameter=data.get('diameter', 25.0),
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        address=data.get('address'),
        alert_threshold=data.get('alert_threshold', 80.0)
    )
    
    db.session.add(container)
    db.session.commit()
    
    return jsonify({
        'message': 'Container created successfully',
        'container': container.to_dict()
    }), 201


@containers_bp.route('/<int:container_id>', methods=['PUT'])
@jwt_required()
def update_container(container_id):
    """Update container"""
    current_user_id = get_jwt_identity()
    container = Container.query.filter_by(
        id=container_id, 
        user_id=current_user_id
    ).first()
    
    if not container:
        return jsonify({'error': 'Container not found'}), 404
    
    data = request.get_json()
    
    # Update allowed fields
    allowed_fields = ['name', 'capacity', 'height', 'diameter', 
                      'latitude', 'longitude', 'address', 'alert_threshold']
    
    for field in allowed_fields:
        if field in data:
            setattr(container, field, data[field])
    
    db.session.commit()
    
    return jsonify({
        'message': 'Container updated successfully',
        'container': container.to_dict()
    }), 200


@containers_bp.route('/<int:container_id>', methods=['DELETE'])
@jwt_required()
def delete_container(container_id):
    """Delete container"""
    current_user_id = get_jwt_identity()
    container = Container.query.filter_by(
        id=container_id, 
        user_id=current_user_id
    ).first()
    
    if not container:
        return jsonify({'error': 'Container not found'}), 404
    
    db.session.delete(container)
    db.session.commit()
    
    return jsonify({
        'message': 'Container deleted successfully'
    }), 200


@containers_bp.route('/<int:container_id>/history', methods=['GET'])
@jwt_required()
def get_container_history(container_id):
    """Get sensor data history for container"""
    current_user_id = get_jwt_identity()
    container = Container.query.filter_by(
        id=container_id, 
        user_id=current_user_id
    ).first()
    
    if not container:
        return jsonify({'error': 'Container not found'}), 404
    
    # Get query parameters
    limit = request.args.get('limit', 100, type=int)
    
    sensor_data = SensorData.query.filter_by(
        container_id=container_id
    ).order_by(
        SensorData.recorded_at.desc()
    ).limit(limit).all()
    
    return jsonify({
        'container_id': container_id,
        'history': [s.to_dict() for s in sensor_data]
    }), 200
