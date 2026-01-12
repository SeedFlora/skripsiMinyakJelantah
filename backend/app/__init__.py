"""
JelantahKu Backend Application
Flask application factory
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_socketio import SocketIO

from app.config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
socketio = SocketIO()


def create_app(config_class=Config):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    socketio.init_app(app, cors_allowed_origins="*")

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.locations import locations_bp
    from app.routes.tutorials import tutorials_bp
    from app.routes.reviews import reviews_bp
    from app.routes.users import users_bp

    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(locations_bp, url_prefix='/api/v1/locations')
    app.register_blueprint(tutorials_bp, url_prefix='/api/v1/tutorials')
    app.register_blueprint(reviews_bp, url_prefix='/api/v1/reviews')
    app.register_blueprint(users_bp, url_prefix='/api/v1/users')

    # Create database tables
    with app.app_context():
        db.create_all()

    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'JelantahKu API is running'}

    return app
