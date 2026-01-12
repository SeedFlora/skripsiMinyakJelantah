"""
Tutorials & Educational Content Routes
"""

from flask import Blueprint, request, jsonify
from app import db
from app.models.tutorial import Tutorial

tutorials_bp = Blueprint('tutorials', __name__)


@tutorials_bp.route('', methods=['GET'])
def get_all_tutorials():
    """Get all tutorials with pagination"""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    
    tutorials = Tutorial.query.paginate(page=page, per_page=limit)
    
    return jsonify({
        'success': True,
        'total': tutorials.total,
        'pages': tutorials.pages,
        'data': [tut.to_dict() for tut in tutorials.items]
    }), 200


@tutorials_bp.route('/<int:tutorial_id>', methods=['GET'])
def get_tutorial_detail(tutorial_id):
    """Get detailed tutorial content"""
    tutorial = Tutorial.query.get(tutorial_id)
    
    if not tutorial:
        return jsonify({'error': 'Tutorial not found'}), 404
    
    return jsonify({
        'success': True,
        'data': tutorial.to_dict_detailed()
    }), 200


@tutorials_bp.route('/category/<string:category>', methods=['GET'])
def get_tutorials_by_category(category):
    """
    Get tutorials by category
    Categories: environment, storage, cooking, recycling, health
    """
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    
    tutorials = Tutorial.query.filter_by(category=category).paginate(
        page=page, per_page=limit
    )
    
    if tutorials.total == 0:
        return jsonify({'error': 'Category not found'}), 404
    
    return jsonify({
        'success': True,
        'category': category,
        'total': tutorials.total,
        'data': [tut.to_dict() for tut in tutorials.items]
    }), 200


@tutorials_bp.route('', methods=['POST'])
def create_tutorial():
    """
    Create new tutorial (Admin only)
    """
    # In production, add @admin_required decorator
    data = request.get_json()
    
    required_fields = ['title', 'category', 'content']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    tutorial = Tutorial(
        title=data['title'],
        category=data['category'],
        content=data['content'],
        description=data.get('description'),
        image_url=data.get('image_url'),
        video_url=data.get('video_url'),
        read_time=data.get('read_time', 5)
    )
    
    db.session.add(tutorial)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Tutorial created',
        'data': tutorial.to_dict()
    }), 201
