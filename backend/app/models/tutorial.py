"""
Tutorial Model - For educational content
"""

from datetime import datetime
from app import db


class Tutorial(db.Model):
    __tablename__ = 'tutorials'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(500))
    category = db.Column(db.String(50), nullable=False)  # environment, storage, cooking, recycling, health
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500))
    video_url = db.Column(db.String(500))
    read_time = db.Column(db.Integer, default=5)  # minutes
    is_published = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'image_url': self.image_url,
            'video_url': self.video_url,
            'read_time': self.read_time,
            'created_at': self.created_at.isoformat()
        }
    
    def to_dict_detailed(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'content': self.content,
            'image_url': self.image_url,
            'video_url': self.video_url,
            'read_time': self.read_time,
            'created_at': self.created_at.isoformat()
        }
