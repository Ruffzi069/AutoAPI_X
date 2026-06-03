"""
Infotainment API Routes for AutoAPI-X
Consolidated routes for navigation, weather, OTA, phone, and messaging
"""

from flask import Blueprint, jsonify, request
from services.navigation_service import NavigationService
from services.weather_service import WeatherService
from services.ota_service import OTAService
from services.phone_service import PhoneService
from services.messaging_service import MessagingService
from services.logging_service import LoggingService

infotainment_bp = Blueprint('infotainment', __name__)

def log_api_call(method, endpoint, request_data, response_data, status_code, transaction_id=None):
    """Log API call with SocketIO emission"""
    from app import socketio
    logging_service = LoggingService(socketio)
    logging_service.log_api_request(method, endpoint, request_data, response_data, status_code, transaction_id)

# Navigation Routes
@infotainment_bp.route('/navigation/start', methods=['POST'])
def start_navigation():
    """Start navigation"""
    try:
        from app import socketio
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        destination = data.get('destination', 'Golden Gate Park')
        
        service = NavigationService(socketio)
        result = service.start_navigation(vin, destination)
        
        transaction_id = result.get('transaction_id')
        log_api_call('POST', '/api/infotainment/navigation/start', data, result, 200, transaction_id)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/infotainment/navigation/start', data, error, 500, None)
        return jsonify(error), 500

@infotainment_bp.route('/navigation/stop', methods=['POST'])
def stop_navigation():
    """Stop navigation"""
    try:
        from app import socketio
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        
        service = NavigationService(socketio)
        result = service.stop_navigation(vin)
        
        transaction_id = result.get('transaction_id')
        log_api_call('POST', '/api/infotainment/navigation/stop', data, result, 200, transaction_id)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/infotainment/navigation/stop', data, error, 500, None)
        return jsonify(error), 500

@infotainment_bp.route('/navigation/location', methods=['GET'])
def get_location():
    """Get current location"""
    try:
        from app import socketio
        service = NavigationService(socketio)
        result = service.get_location()
        log_api_call('GET', '/api/infotainment/navigation/location', None, result, 200, None)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('GET', '/api/infotainment/navigation/location', None, error, 500, None)
        return jsonify(error), 500

@infotainment_bp.route('/navigation/chargers', methods=['GET'])
def get_chargers():
    """Get nearby chargers"""
    try:
        from app import socketio
        service = NavigationService(socketio)
        result = service.get_nearby_chargers()
        log_api_call('GET', '/api/infotainment/navigation/chargers', None, result, 200, None)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('GET', '/api/infotainment/navigation/chargers', None, error, 500, None)
        return jsonify(error), 500

@infotainment_bp.route('/navigation/status', methods=['GET'])
def get_nav_status():
    """Get navigation status"""
    try:
        from app import socketio
        service = NavigationService(socketio)
        result = service.get_status()
        log_api_call('GET', '/api/infotainment/navigation/status', None, result, 200, None)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('GET', '/api/infotainment/navigation/status', None, error, 500, None)
        return jsonify(error), 500

# Weather Routes
@infotainment_bp.route('/weather/current', methods=['GET'])
def get_current_weather():
    """Get current weather"""
    try:
        from app import socketio
        service = WeatherService(socketio)
        result = service.get_current_weather()
        log_api_call('GET', '/api/infotainment/weather/current', None, result, 200, None)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('GET', '/api/infotainment/weather/current', None, error, 500, None)
        return jsonify(error), 500

@infotainment_bp.route('/weather/forecast', methods=['GET'])
def get_forecast():
    """Get weather forecast"""
    try:
        from app import socketio
        service = WeatherService(socketio)
        result = service.get_forecast()
        log_api_call('GET', '/api/infotainment/weather/forecast', None, result, 200, None)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('GET', '/api/infotainment/weather/forecast', None, error, 500, None)
        return jsonify(error), 500

# OTA Routes
@infotainment_bp.route('/ota/check', methods=['POST'])
def check_updates():
    """Check for OTA updates"""
    try:
        from app import socketio
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        
        service = OTAService(socketio)
        result = service.check_updates(vin)
        
        transaction_id = result.get('transaction_id')
        log_api_call('POST', '/api/infotainment/ota/check', data, result, 200, transaction_id)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/infotainment/ota/check', data, error, 500, None)
        return jsonify(error), 500

@infotainment_bp.route('/ota/download', methods=['POST'])
def download_update():
    """Download OTA update"""
    try:
        from app import socketio
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        
        service = OTAService(socketio)
        result = service.download_update(vin)
        
        transaction_id = result.get('transaction_id')
        log_api_call('POST', '/api/infotainment/ota/download', data, result, 200, transaction_id)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/infotainment/ota/download', data, error, 500, None)
        return jsonify(error), 500

@infotainment_bp.route('/ota/install', methods=['POST'])
def install_update():
    """Install OTA update"""
    try:
        from app import socketio
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        
        service = OTAService(socketio)
        result = service.install_update(vin)
        
        transaction_id = result.get('transaction_id')
        log_api_call('POST', '/api/infotainment/ota/install', data, result, 200, transaction_id)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/infotainment/ota/install', data, error, 500, None)
        return jsonify(error), 500

@infotainment_bp.route('/ota/status', methods=['GET'])
def get_ota_status():
    """Get OTA status"""
    try:
        from app import socketio
        service = OTAService(socketio)
        result = service.get_status()
        log_api_call('GET', '/api/infotainment/ota/status', None, result, 200, None)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('GET', '/api/infotainment/ota/status', None, error, 500, None)
        return jsonify(error), 500

@infotainment_bp.route('/ota/history', methods=['GET'])
def get_ota_history():
    """Get OTA history"""
    try:
        from app import socketio
        service = OTAService(socketio)
        result = service.get_history()
        log_api_call('GET', '/api/infotainment/ota/history', None, result, 200, None)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('GET', '/api/infotainment/ota/history', None, error, 500, None)
        return jsonify(error), 500

# Phone Routes
@infotainment_bp.route('/phone/sync', methods=['POST'])
def sync_phone():
    """Sync phone"""
    try:
        from app import socketio
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        
        service = PhoneService(socketio)
        result = service.sync_phone(vin)
        
        transaction_id = result.get('transaction_id')
        log_api_call('POST', '/api/infotainment/phone/sync', data, result, 200, transaction_id)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/infotainment/phone/sync', data, error, 500, None)
        return jsonify(error), 500

@infotainment_bp.route('/phone/disconnect', methods=['POST'])
def disconnect_phone():
    """Disconnect phone"""
    try:
        from app import socketio
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        
        service = PhoneService(socketio)
        result = service.disconnect_phone(vin)
        
        transaction_id = result.get('transaction_id')
        log_api_call('POST', '/api/infotainment/phone/disconnect', data, result, 200, transaction_id)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('POST', '/api/infotainment/phone/disconnect', data, error, 500, None)
        return jsonify(error), 500

@infotainment_bp.route('/phone/status', methods=['GET'])
def get_phone_status():
    """Get phone status"""
    try:
        from app import socketio
        service = PhoneService(socketio)
        result = service.get_status()
        log_api_call('GET', '/api/infotainment/phone/status', None, result, 200, None)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('GET', '/api/infotainment/phone/status', None, error, 500, None)
        return jsonify(error), 500

@infotainment_bp.route('/phone/calls', methods=['GET'])
def get_calls():
    """Get call history"""
    try:
        from app import socketio
        service = PhoneService(socketio)
        result = service.get_call_history()
        log_api_call('GET', '/api/infotainment/phone/calls', None, result, 200, None)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('GET', '/api/infotainment/phone/calls', None, error, 500, None)
        return jsonify(error), 500

# Messaging Routes
@infotainment_bp.route('/messages', methods=['GET'])
def get_messages():
    """Get messages"""
    try:
        from app import socketio
        service = MessagingService(socketio)
        result = service.get_messages()
        log_api_call('GET', '/api/infotainment/messages', None, result, 200, None)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('GET', '/api/infotainment/messages', None, error, 500, None)
        return jsonify(error), 500

@infotainment_bp.route('/messages/unread', methods=['GET'])
def get_unread_count():
    """Get unread message count"""
    try:
        from app import socketio
        service = MessagingService(socketio)
        result = service.get_unread_count()
        log_api_call('GET', '/api/infotainment/messages/unread', None, result, 200, None)
        return jsonify(result), 200
    except Exception as e:
        error = {'success': False, 'error': str(e)}
        log_api_call('GET', '/api/infotainment/messages/unread', None, error, 500, None)
        return jsonify(error), 500
