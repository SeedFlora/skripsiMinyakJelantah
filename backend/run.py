"""
JelantahKu Backend Entry Point
"""

from app import create_app, socketio

app = create_app()

if __name__ == '__main__':
    print("🛢️  JelantahKu Backend Server Starting...")
    print("📍 API available at: http://localhost:5000")
    print("📚 Health check: http://localhost:5000/health")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
