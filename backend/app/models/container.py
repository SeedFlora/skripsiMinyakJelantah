"""
Container Model
"""

from datetime import datetime
from app import db


class Container(db.Model):
    """Smart container model for IoT device"""
    
    __tablename__ = 'containers'
    
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.String(50), unique=True, nullable=False)  # ESP32 unique ID
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Container specifications
    capacity = db.Column(db.Float, default=20.0)  # Maximum capacity in liters
    height = db.Column(db.Float, default=40.0)  # Container height in cm
    diameter = db.Column(db.Float, default=25.0)  # Container diameter in cm
    
    # Current status
    current_volume = db.Column(db.Float, default=0.0)  # Current volume in liters
    current_percentage = db.Column(db.Float, default=0.0)  # Percentage filled
    current_temperature = db.Column(db.Float, default=0.0)  # Temperature in Celsius
    
    # Location
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    address = db.Column(db.Text)
    
    # Status
    is_online = db.Column(db.Boolean, default=False)
    last_seen = db.Column(db.DateTime)
    alert_threshold = db.Column(db.Float, default=80.0)  # Alert when 80% full
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sensor_data = db.relationship('SensorData', backref='container', lazy='dynamic')
    transactions = db.relationship('Transaction', backref='container', lazy='dynamic')
    
    def update_from_sensor(self, volume, temperature, percentage):
        """Update container data from IoT sensor"""
        self.current_volume = volume
        self.current_temperature = temperature
        self.current_percentage = percentage
        self.is_online = True
        self.last_seen = datetime.utcnow()
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'device_id': self.device_id,
            'name': self.name,
            'user_id': self.user_id,
            'capacity': self.capacity,
            'height': self.height,
            'diameter': self.diameter,
            'current_volume': self.current_volume,
            'current_percentage': self.current_percentage,
            'current_temperature': self.current_temperature,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'address': self.address,
            'is_online': self.is_online,
            'last_seen': self.last_seen.isoformat() if self.last_seen else None,
            'alert_threshold': self.alert_threshold,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Container {self.device_id}>'
