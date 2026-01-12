"""
Transaction Model
"""

from datetime import datetime
from app import db


class Transaction(db.Model):
    """Transaction model for pickup and sales"""
    
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    container_id = db.Column(db.Integer, db.ForeignKey('containers.id'), nullable=False)
    collector_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Transaction details
    volume = db.Column(db.Float, nullable=False)  # Volume in liters
    price_per_liter = db.Column(db.Float, default=5000.0)  # Price per liter in IDR
    total_price = db.Column(db.Float)  # Total price
    
    # Status: pending, confirmed, in_progress, completed, cancelled
    status = db.Column(db.String(20), default='pending')
    
    # Scheduling
    scheduled_date = db.Column(db.DateTime)
    completed_date = db.Column(db.DateTime)
    
    # Additional info
    notes = db.Column(db.Text)
    rating = db.Column(db.Integer)  # 1-5 stars
    review = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship for collector
    collector = db.relationship('User', foreign_keys=[collector_id], backref='collected_transactions')
    
    def calculate_total(self):
        """Calculate total price"""
        self.total_price = self.volume * self.price_per_liter
        return self.total_price
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'container_id': self.container_id,
            'collector_id': self.collector_id,
            'volume': self.volume,
            'price_per_liter': self.price_per_liter,
            'total_price': self.total_price,
            'status': self.status,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'completed_date': self.completed_date.isoformat() if self.completed_date else None,
            'notes': self.notes,
            'rating': self.rating,
            'review': self.review,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Transaction {self.id}>'
