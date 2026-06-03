"""
Media API Routes for AutoAPI-X
Handles Spotify, YouTube Music, and media control
"""

from flask import Blueprint, jsonify, request
from services.media_service import MediaService
from services.logging_service import LoggingService

media_bp = Blueprint('media', __name__)

def get_media_service():
    """Get media service instance with SocketIO"""
    from app import socketio
    return MediaService(socketio)

def log_api_call(method, endpoint, request_data, response_data, status_code, transaction_id=None):
    """Log API call with SocketIO emission"""
    from app import socketio
    logging_service = LoggingService(socketio)
    logging_service.log_api_request(method, endpoint, request_data, response_data, status_code, transaction_id)

@media_bp.route('/play', methods=['POST'])
def play_media():
    """Play media"""
    try:
        # Get VIN from request
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        
        service = get_media_service()
        result = service.play(vin)
        
        # Extract transaction ID
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 400
        log_api_call('POST', '/api/media/play', data, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/media/play', data, error_response, 500, None)
        return jsonify(error_response), 500

@media_bp.route('/pause', methods=['POST'])
def pause_media():
    """Pause media"""
    try:
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        
        service = get_media_service()
        result = service.pause(vin)
        
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 400
        log_api_call('POST', '/api/media/pause', data, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/media/pause', data, error_response, 500, None)
        return jsonify(error_response), 500

@media_bp.route('/next', methods=['POST'])
def next_track():
    """Skip to next track"""
    try:
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        
        service = get_media_service()
        result = service.next_track(vin)
        
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 400
        log_api_call('POST', '/api/media/next', data, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/media/next', data, error_response, 500, None)
        return jsonify(error_response), 500

@media_bp.route('/previous', methods=['POST'])
def previous_track():
    """Go to previous track"""
    try:
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        
        service = get_media_service()
        result = service.previous_track(vin)
        
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 400
        log_api_call('POST', '/api/media/previous', data, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/media/previous', data, error_response, 500, None)
        return jsonify(error_response), 500

@media_bp.route('/volume/up', methods=['POST'])
def volume_up():
    """Increase volume"""
    try:
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        amount = data.get('amount', 5)
        
        service = get_media_service()
        result = service.volume_up(vin, amount)
        
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 400
        log_api_call('POST', '/api/media/volume/up', data, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/media/volume/up', data, error_response, 500, None)
        return jsonify(error_response), 500

@media_bp.route('/volume/down', methods=['POST'])
def volume_down():
    """Decrease volume"""
    try:
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        amount = data.get('amount', 5)
        
        service = get_media_service()
        result = service.volume_down(vin, amount)
        
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 400
        log_api_call('POST', '/api/media/volume/down', data, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/media/volume/down', data, error_response, 500, None)
        return jsonify(error_response), 500

@media_bp.route('/platform', methods=['POST'])
def set_platform():
    """Switch media platform (spotify/youtube)"""
    try:
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        platform = data.get('platform', 'spotify')
        
        service = get_media_service()
        result = service.set_platform(vin, platform)
        
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 400
        log_api_call('POST', '/api/media/platform', data, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/media/platform', data, error_response, 500, None)
        return jsonify(error_response), 500

@media_bp.route('/status', methods=['GET'])
def get_status():
    """Get current media status"""
    try:
        service = get_media_service()
        result = service.get_status()
        
        log_api_call('GET', '/api/media/status', None, result, 200, None)
        return jsonify(result), 200
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('GET', '/api/media/status', None, error_response, 500, None)
        return jsonify(error_response), 500
