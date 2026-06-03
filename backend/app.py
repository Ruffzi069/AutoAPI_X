"""
AutoAPI-X - Connected Vehicle API Security Simulation Platform
Main Flask Application Entry Point
"""

from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from config.config import Config
from database.database import init_db, seed_data
from routes.vehicle_routes import vehicle_bp
from routes.system_routes import system_bp
from routes.media_routes import media_bp
from routes.infotainment_routes import infotainment_bp

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for future frontend integration
CORS(app)

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# Register blueprints
app.register_blueprint(system_bp, url_prefix='/api/system')
app.register_blueprint(vehicle_bp, url_prefix='/api/vehicles')
app.register_blueprint(media_bp, url_prefix='/api/media')
app.register_blueprint(infotainment_bp, url_prefix='/api/infotainment')

# Initialize database
with app.app_context():
    init_db()
    seed_data()

# SocketIO event handlers for future frontend integration
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    print("=" * 60)
    print("AutoAPI-X - Connected Vehicle API Security Platform")
    print("=" * 60)
    print("Backend server starting...")
    print("API endpoints available at http://localhost:5000/api")
    print("SocketIO enabled for real-time updates")
    print("=" * 60)
    
    # Use allow_unsafe_werkzeug=True for development with eventlet
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
