"""
Location Model - For waste oil collection centers
"""

from datetime import datetime
from app import db


class Location(db.Model):
    __tablename__ = 'locations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    address = db.Column(db.String(500), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    province = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    phone = db.Column(db.String(20))
    whatsapp = db.Column(db.String(20))
    email = db.Column(db.String(255))
    opening_hours = db.Column(db.String(100))  # "08:00-17:00"
    closing_day = db.Column(db.String(50))     # "Sunday"
    price_per_liter = db.Column(db.Float)
    certification = db.Column(db.String(200))  # "ISO 9001", etc
    image_url = db.Column(db.String(500))
    
    # Relationships
    reviews = db.relationship('Review', backref='location', lazy=True, cascade='all, delete-orphan')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'address': self.address,
            'city': self.city,
            'province': self.province,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'phone': self.phone,
            'whatsapp': self.whatsapp,
            'email': self.email,
            'opening_hours': self.opening_hours,
            'closing_day': self.closing_day,
            'price_per_liter': self.price_per_liter,
            'certification': self.certification,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat()
        }
    
    def to_dict_with_distance(self, lat, lng):
        """Calculate distance from user location"""
        import math
        
        lat1, lon1 = math.radians(lat), math.radians(lng)
        lat2, lon2 = math.radians(self.latitude), math.radians(self.longitude)
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        km = 6371 * c
        
        data = self.to_dict()
        data['distance_km'] = round(km, 2)
        return data
