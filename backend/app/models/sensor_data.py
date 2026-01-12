"""
Sensor Data Model
"""

from datetime import datetime
from app import db


class SensorData(db.Model):
    """Sensor data history from IoT devices"""
    
    __tablename__ = 'sensor_data'
    
    id = db.Column(db.Integer, primary_key=True)
    container_id = db.Column(db.Integer, db.ForeignKey('containers.id'), nullable=False)
    
    # Sensor readings
    volume = db.Column(db.Float, nullable=False)  # Volume in liters
    percentage = db.Column(db.Float, nullable=False)  # Percentage filled
    temperature = db.Column(db.Float)  # Temperature in Celsius
    distance = db.Column(db.Float)  # Raw distance from ultrasonic sensor in cm
    
    # Device info
    battery_level = db.Column(db.Float)  # Battery percentage if applicable
    wifi_strength = db.Column(db.Integer)  # WiFi signal strength (RSSI)
    
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'container_id': self.container_id,
            'volume': self.volume,
            'percentage': self.percentage,
            'temperature': self.temperature,
            'distance': self.distance,
            'battery_level': self.battery_level,
            'wifi_strength': self.wifi_strength,
            'recorded_at': self.recorded_at.isoformat() if self.recorded_at else None
        }
    
    def __repr__(self):
        return f'<SensorData {self.id} - Container {self.container_id}>'
