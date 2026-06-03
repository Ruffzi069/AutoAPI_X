"""
Vehicle API Routes for AutoAPI-X
"""

from flask import Blueprint, jsonify, request, current_app
from services.vehicle_service import VehicleService
from services.logging_service import LoggingService

vehicle_bp = Blueprint('vehicle', __name__)

def get_vehicle_service():
    """Get vehicle service instance with SocketIO"""
    from app import socketio
    return VehicleService(socketio)

def log_api_call(method, endpoint, request_data, response_data, status_code, transaction_id=None):
    """Log API call with SocketIO emission"""
    from app import socketio
    logging_service = LoggingService(socketio)
    logging_service.log_api_request(method, endpoint, request_data, response_data, status_code, transaction_id)

@vehicle_bp.route('', methods=['GET'])
def get_vehicles():
    """Get all vehicles"""
    try:
        service = get_vehicle_service()
        vehicles = service.get_all_vehicles()
        
        response_data = {
            'success': True,
            'count': len(vehicles),
            'vehicles': [v.to_dict() for v in vehicles]
        }
        
        log_api_call('GET', '/api/vehicles', None, response_data, 200)
        return jsonify(response_data), 200
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('GET', '/api/vehicles', None, error_response, 500)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>', methods=['GET'])
def get_vehicle(vin):
    """Get vehicle by VIN"""
    try:
        service = get_vehicle_service()
        vehicle = service.get_vehicle_by_vin(vin)
        
        if not vehicle:
            response_data = {'success': False, 'message': 'Vehicle not found'}
            log_api_call('GET', f'/api/vehicles/{vin}', None, response_data, 404)
            return jsonify(response_data), 404
        
        response_data = {'success': True, 'vehicle': vehicle.to_dict()}
        log_api_call('GET', f'/api/vehicles/{vin}', None, response_data, 200)
        return jsonify(response_data), 200
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('GET', f'/api/vehicles/{vin}', None, error_response, 500)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>/lock', methods=['POST'])
def lock_vehicle(vin):
    """Lock vehicle doors"""
    try:
        service = get_vehicle_service()
        result = service.lock_vehicle(vin)
        
        # Extract transaction ID from result
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/lock', None, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/lock', None, error_response, 500, None)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>/unlock', methods=['POST'])
def unlock_vehicle(vin):
    """Unlock vehicle doors"""
    try:
        service = get_vehicle_service()
        result = service.unlock_vehicle(vin)
        
        # Extract transaction ID from result
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/unlock', None, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/unlock', None, error_response, 500, None)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>/boot/open', methods=['POST'])
def open_boot(vin):
    """Open vehicle boot"""
    try:
        service = get_vehicle_service()
        result = service.open_boot(vin)
        
        # Extract transaction ID from result
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/boot/open', None, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/boot/open', None, error_response, 500, None)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>/engine/start', methods=['POST'])
def start_engine(vin):
    """Start vehicle engine"""
    try:
        service = get_vehicle_service()
        result = service.start_engine(vin)
        
        # Extract transaction ID from result
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/engine/start', None, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/engine/start', None, error_response, 500, None)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>/horn', methods=['POST'])
def activate_horn(vin):
    """Activate vehicle horn"""
    try:
        service = get_vehicle_service()
        result = service.activate_horn(vin)
        
        # Extract transaction ID from result
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/horn', None, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/horn', None, error_response, 500, None)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>/lights/flash', methods=['POST'])
def flash_lights(vin):
    """Flash vehicle lights"""
    try:
        service = get_vehicle_service()
        result = service.flash_lights(vin)
        
        # Extract transaction ID from result
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/lights/flash', None, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/lights/flash', None, error_response, 500, None)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>/boot/close', methods=['POST'])
def close_boot(vin):
    """Close vehicle boot"""
    try:
        service = get_vehicle_service()
        result = service.close_boot(vin)
        
        # Extract transaction ID from result
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/boot/close', None, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/boot/close', None, error_response, 500, None)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>/engine/stop', methods=['POST'])
def stop_engine(vin):
    """Stop vehicle engine"""
    try:
        service = get_vehicle_service()
        result = service.stop_engine(vin)
        
        # Extract transaction ID from result
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/engine/stop', None, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/engine/stop', None, error_response, 500, None)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>/locate', methods=['POST'])
def locate_vehicle(vin):
    """Locate vehicle (GPS ping)"""
    try:
        service = get_vehicle_service()
        result = service.locate_vehicle(vin)
        
        # Extract transaction ID from result
        transaction_id = result.get('transaction_id')
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/locate', None, result, status_code, transaction_id)
        return jsonify(result), status_code
        
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/locate', None, error_response, 500, None)
        return jsonify(error_response), 500
