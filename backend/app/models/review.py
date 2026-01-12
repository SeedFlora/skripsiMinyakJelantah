"""
Review/Rating Model
"""

from datetime import datetime
from app import db


class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    review_text = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500))
    
    # Relationships
    user = db.relationship('User', backref='reviews')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.name if self.user else 'Anonymous',
            'location_id': self.location_id,
            'rating': self.rating,
            'review_text': self.review_text,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat()
        }
