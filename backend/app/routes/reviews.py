"""
Reviews & Ratings Routes
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.review import Review
from app.models.user import User
from app.models.location import Location

reviews_bp = Blueprint('reviews', __name__)


@reviews_bp.route('', methods=['POST'])
@jwt_required()
def create_review():
    """Create a new review for a location"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['location_id', 'rating', 'review_text']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    # Validate location exists
    location = Location.query.get(data['location_id'])
    if not location:
        return jsonify({'error': 'Location not found'}), 404
    
    # Validate rating
    if not (1 <= data['rating'] <= 5):
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400
    
    review = Review(
        user_id=user_id,
        location_id=data['location_id'],
        rating=data['rating'],
        review_text=data['review_text'],
        image_url=data.get('image_url')
    )
    
    db.session.add(review)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Review created',
        'data': review.to_dict()
    }), 201


@reviews_bp.route('/location/<int:location_id>', methods=['GET'])
def get_location_reviews(location_id):
    """Get all reviews for a location"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    reviews = Review.query.filter_by(location_id=location_id).paginate(
        page=page, per_page=limit
    )
    
    return jsonify({
        'success': True,
        'total': reviews.total,
        'data': [review.to_dict() for review in reviews.items]
    }), 200


@reviews_bp.route('/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    """Delete a review (only by review owner)"""
    user_id = get_jwt_identity()
    review = Review.query.get(review_id)
    
    if not review:
        return jsonify({'error': 'Review not found'}), 404
    
    if review.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(review)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Review deleted'
    }), 200
