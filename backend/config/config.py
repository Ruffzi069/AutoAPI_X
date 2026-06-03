"""
Configuration Management for AutoAPI-X
"""

import os

class Config:
    """Base configuration class"""
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'autoapi-x-dev-secret-key-change-in-production'
    DEBUG = True
    
    # Database settings
    DATABASE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'autoapi.db')
    
    # CAN settings
    CAN_INTERFACE = 'vcan0'
    CAN_BITRATE = 500000
    
    # Logging settings
    LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
    API_LOG_DIR = os.path.join(LOG_DIR, 'api_logs')
    CAN_LOG_DIR = os.path.join(LOG_DIR, 'can_logs')
    EVENT_LOG_DIR = os.path.join(LOG_DIR, 'event_logs')
    
    # SocketIO settings
    SOCKETIO_ASYNC_MODE = 'threading'
    
    @staticmethod
    def init_app(app):
        """Initialize application with configuration"""
        # Create necessary directories
        os.makedirs(Config.API_LOG_DIR, exist_ok=True)
        os.makedirs(Config.CAN_LOG_DIR, exist_ok=True)
        os.makedirs(Config.EVENT_LOG_DIR, exist_ok=True)
