"""
Locations & Maps Routes - For finding waste oil collection centers
"""

from flask import Blueprint, request, jsonify
from app import db
from app.models.location import Location
from app.models.review import Review
from sqlalchemy import func

locations_bp = Blueprint('locations', __name__)


@locations_bp.route('', methods=['GET'])
def get_all_locations():
    """Get all locations with pagination"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    
    locations = Location.query.paginate(page=page, per_page=limit)
    
    return jsonify({
        'success': True,
        'total': locations.total,
        'pages': locations.pages,
        'current_page': page,
        'data': [loc.to_dict() for loc in locations.items]
    }), 200


@locations_bp.route('/nearby', methods=['GET'])
def get_nearby_locations():
    """
    Get locations nearby a coordinate
    Query params: lat, lng, radius (km)
    """
    try:
        lat = float(request.args.get('lat'))
        lng = float(request.args.get('lng'))
        radius = int(request.args.get('radius', 5))
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid parameters'}), 400
    
    # Simple distance calculation (using Haversine formula would be more accurate)
    # For now, using simple lat/lng difference
    min_lat = lat - (radius / 111.0)
    max_lat = lat + (radius / 111.0)
    min_lng = lng - (radius / (111.0 * abs(__import__('math').cos(__import__('math').radians(lat)))))
    max_lng = lng + (radius / (111.0 * abs(__import__('math').cos(__import__('math').radians(lat)))))
    
    locations = Location.query.filter(
        Location.latitude.between(min_lat, max_lat),
        Location.longitude.between(min_lng, max_lng)
    ).all()
    
    return jsonify({
        'success': True,
        'count': len(locations),
        'data': [loc.to_dict_with_distance(lat, lng) for loc in locations]
    }), 200


@locations_bp.route('/<int:location_id>', methods=['GET'])
def get_location_detail(location_id):
    """Get detailed info about a location"""
    location = Location.query.get(location_id)
    
    if not location:
        return jsonify({'error': 'Location not found'}), 404
    
    # Get average rating
    avg_rating = db.session.query(func.avg(Review.rating)).filter(
        Review.location_id == location_id
    ).scalar() or 0
    
    return jsonify({
        'success': True,
        'data': location.to_dict(),
        'average_rating': float(avg_rating),
        'reviews_count': Review.query.filter_by(location_id=location_id).count()
    }), 200


@locations_bp.route('/<int:location_id>/reviews', methods=['GET'])
def get_location_reviews(location_id):
    """Get reviews for a location"""
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
