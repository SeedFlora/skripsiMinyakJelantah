"""
Transaction Routes
"""

from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.transaction import Transaction
from app.models.container import Container
from app.models.user import User

transactions_bp = Blueprint('transactions', __name__)


@transactions_bp.route('', methods=['GET'])
@jwt_required()
def get_transactions():
    """Get all transactions for current user"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role == 'collector':
        # Collectors see transactions assigned to them
        transactions = Transaction.query.filter_by(collector_id=current_user_id).all()
    else:
        # Users see their own transactions
        transactions = Transaction.query.filter_by(user_id=current_user_id).all()
    
    return jsonify({
        'transactions': [t.to_dict() for t in transactions]
    }), 200


@transactions_bp.route('/<int:transaction_id>', methods=['GET'])
@jwt_required()
def get_transaction(transaction_id):
    """Get single transaction by ID"""
    current_user_id = get_jwt_identity()
    transaction = Transaction.query.get(transaction_id)
    
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    
    # Check permission
    if transaction.user_id != current_user_id and transaction.collector_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'transaction': transaction.to_dict()
    }), 200


@transactions_bp.route('/pickup', methods=['POST'])
@jwt_required()
def create_pickup_request():
    """Create a new pickup request"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not data.get('container_id'):
        return jsonify({'error': 'container_id is required'}), 400
    
    # Verify container ownership
    container = Container.query.filter_by(
        id=data['container_id'],
        user_id=current_user_id
    ).first()
    
    if not container:
        return jsonify({'error': 'Container not found'}), 404
    
    # Create transaction
    transaction = Transaction(
        user_id=current_user_id,
        container_id=data['container_id'],
        volume=container.current_volume,
        price_per_liter=data.get('price_per_liter', 5000.0),
        notes=data.get('notes'),
        status='pending'
    )
    
    # Parse scheduled date
    if data.get('scheduled_date'):
        transaction.scheduled_date = datetime.fromisoformat(data['scheduled_date'])
    
    # Calculate total
    transaction.calculate_total()
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify({
        'message': 'Pickup request created successfully',
        'transaction': transaction.to_dict()
    }), 201


@transactions_bp.route('/<int:transaction_id>/accept', methods=['POST'])
@jwt_required()
def accept_pickup(transaction_id):
    """Collector accepts a pickup request"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    # Only collectors can accept
    if user.role != 'collector':
        return jsonify({'error': 'Only collectors can accept pickups'}), 403
    
    transaction = Transaction.query.get(transaction_id)
    
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    
    if transaction.status != 'pending':
        return jsonify({'error': 'Transaction is not pending'}), 400
    
    transaction.collector_id = current_user_id
    transaction.status = 'confirmed'
    db.session.commit()
    
    return jsonify({
        'message': 'Pickup accepted successfully',
        'transaction': transaction.to_dict()
    }), 200


@transactions_bp.route('/<int:transaction_id>/complete', methods=['POST'])
@jwt_required()
def complete_pickup(transaction_id):
    """Mark pickup as completed"""
    current_user_id = get_jwt_identity()
    transaction = Transaction.query.get(transaction_id)
    
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    
    # Check permission
    if transaction.collector_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Update actual volume if provided
    if data.get('actual_volume'):
        transaction.volume = data['actual_volume']
        transaction.calculate_total()
    
    transaction.status = 'completed'
    transaction.completed_date = datetime.utcnow()
    
    # Reset container volume
    container = Container.query.get(transaction.container_id)
    if container:
        container.current_volume = 0
        container.current_percentage = 0
    
    db.session.commit()
    
    return jsonify({
        'message': 'Pickup completed successfully',
        'transaction': transaction.to_dict()
    }), 200


@transactions_bp.route('/<int:transaction_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_pickup(transaction_id):
    """Cancel a pickup request"""
    current_user_id = get_jwt_identity()
    transaction = Transaction.query.get(transaction_id)
    
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    
    # Check permission
    if transaction.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if transaction.status == 'completed':
        return jsonify({'error': 'Cannot cancel completed transaction'}), 400
    
    transaction.status = 'cancelled'
    db.session.commit()
    
    return jsonify({
        'message': 'Pickup cancelled successfully',
        'transaction': transaction.to_dict()
    }), 200


@transactions_bp.route('/<int:transaction_id>/rate', methods=['POST'])
@jwt_required()
def rate_transaction(transaction_id):
    """Rate a completed transaction"""
    current_user_id = get_jwt_identity()
    transaction = Transaction.query.get(transaction_id)
    
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    
    if transaction.user_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if transaction.status != 'completed':
        return jsonify({'error': 'Can only rate completed transactions'}), 400
    
    data = request.get_json()
    
    rating = data.get('rating')
    if not rating or rating < 1 or rating > 5:
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400
    
    transaction.rating = rating
    transaction.review = data.get('review')
    db.session.commit()
    
    return jsonify({
        'message': 'Rating submitted successfully',
        'transaction': transaction.to_dict()
    }), 200


@transactions_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Get transaction statistics for current user"""
    current_user_id = get_jwt_identity()
    
    transactions = Transaction.query.filter_by(
        user_id=current_user_id,
        status='completed'
    ).all()
    
    total_volume = sum(t.volume for t in transactions)
    total_earnings = sum(t.total_price for t in transactions)
    total_transactions = len(transactions)
    
    return jsonify({
        'stats': {
            'total_volume': total_volume,
            'total_earnings': total_earnings,
            'total_transactions': total_transactions,
            'average_per_transaction': total_earnings / total_transactions if total_transactions > 0 else 0
        }
    }), 200
