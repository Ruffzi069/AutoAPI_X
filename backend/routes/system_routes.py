"""
System API Routes for AutoAPI-X
"""

from flask import Blueprint, jsonify
from services.logging_service import LoggingService
from datetime import datetime

system_bp = Blueprint('system', __name__)

@system_bp.route('/status', methods=['GET'])
def get_system_status():
    """Get system status"""
    try:
        logging_service = LoggingService()
        
        # Get recent logs count
        api_logs = logging_service.get_recent_api_logs(10)
        can_logs = logging_service.get_recent_can_logs(10)
        event_logs = logging_service.get_recent_event_logs(10)
        
        response = {
            'success': True,
            'status': 'online',
            'timestamp': datetime.now().isoformat(),
            'platform': 'AutoAPI-X',
            'version': '1.0.0-phase1',
            'components': {
                'api_server': 'running',
                'database': 'connected',
                'can_interface': 'initialized',
                'socketio': 'active'
            },
            'statistics': {
                'recent_api_calls': len(api_logs),
                'recent_can_frames': len(can_logs),
                'recent_events': len(event_logs)
            }
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'status': 'error',
            'error': str(e)
        }), 500
