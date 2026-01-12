"""
IoT Routes - For ESP32 Device Communication
"""

from flask import Blueprint, request, jsonify
from app import db, socketio
from app.models.container import Container
from app.models.sensor_data import SensorData
from app.services.notification import send_push_notification

iot_bp = Blueprint('iot', __name__)


@iot_bp.route('/data', methods=['POST'])
def receive_sensor_data():
    """
    Receive sensor data from ESP32 device
    This endpoint is called by the IoT device to send sensor readings
    """
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['device_id', 'volume', 'percentage']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Find container by device_id
    container = Container.query.filter_by(device_id=data['device_id']).first()
    
    if not container:
        return jsonify({'error': 'Device not registered'}), 404
    
    # Update container data
    container.update_from_sensor(
        volume=data['volume'],
        temperature=data.get('temperature', 0),
        percentage=data['percentage']
    )
    
    # Save sensor data history
    sensor_data = SensorData(
        container_id=container.id,
        volume=data['volume'],
        percentage=data['percentage'],
        temperature=data.get('temperature'),
        distance=data.get('distance'),
        wifi_strength=data.get('wifi_strength')
    )
    
    db.session.add(sensor_data)
    db.session.commit()
    
    # Check if alert threshold reached
    if container.current_percentage >= container.alert_threshold:
        # Send push notification to user
        send_push_notification(
            user_id=container.user_id,
            title='Container Hampir Penuh!',
            body=f'{container.name} sudah {container.current_percentage:.0f}% penuh. Segera jadwalkan pickup!'
        )
    
    # Emit real-time update via WebSocket
    socketio.emit('sensor_update', {
        'container_id': container.id,
        'device_id': container.device_id,
        'volume': container.current_volume,
        'percentage': container.current_percentage,
        'temperature': container.current_temperature
    }, room=f'user_{container.user_id}')
    
    return jsonify({
        'status': 'success',
        'message': 'Data received',
        'container': container.to_dict()
    }), 200


@iot_bp.route('/register', methods=['POST'])
def register_device():
    """
    Register a new IoT device
    Called during initial device setup
    """
    data = request.get_json()
    
    if not data.get('device_id'):
        return jsonify({'error': 'device_id is required'}), 400
    
    # Check if device already exists
    existing = Container.query.filter_by(device_id=data['device_id']).first()
    
    if existing:
        return jsonify({
            'status': 'exists',
            'message': 'Device already registered',
            'container_id': existing.id
        }), 200
    
    return jsonify({
        'status': 'not_registered',
        'message': 'Device not registered. Please register via mobile app.'
    }), 200


@iot_bp.route('/config/<device_id>', methods=['GET'])
def get_device_config(device_id):
    """
    Get configuration for IoT device
    Device can fetch its settings from server
    """
    container = Container.query.filter_by(device_id=device_id).first()
    
    if not container:
        return jsonify({'error': 'Device not found'}), 404
    
    return jsonify({
        'config': {
            'device_id': container.device_id,
            'container_height': container.height,
            'container_diameter': container.diameter,
            'alert_threshold': container.alert_threshold,
            'report_interval': 60  # Report every 60 seconds
        }
    }), 200


@iot_bp.route('/ping', methods=['POST'])
def device_ping():
    """
    Simple ping endpoint for device health check
    """
    data = request.get_json()
    device_id = data.get('device_id')
    
    if device_id:
        container = Container.query.filter_by(device_id=device_id).first()
        if container:
            container.is_online = True
            from datetime import datetime
            container.last_seen = datetime.utcnow()
            db.session.commit()
    
    return jsonify({
        'status': 'pong',
        'message': 'Device is connected'
    }), 200
