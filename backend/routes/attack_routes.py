"""
Attack Simulation API Routes for AutoAPI-X
Generates realistic CAN traffic for cybersecurity demonstrations
"""

from flask import Blueprint, jsonify, request
from services.attack_simulation_service import AttackSimulationService

attack_bp = Blueprint('attack', __name__)

def get_attack_service():
    """Get attack simulation service instance with SocketIO"""
    from app import socketio
    return AttackSimulationService(socketio)

@attack_bp.route('/replay', methods=['POST'])
def simulate_replay_attack():
    """
    Simulate Replay Attack
    
    Body:
    {
        "vin": "5YJ3E1EA1KF000001",
        "iterations": 5
    }
    """
    try:
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        iterations = data.get('iterations', 5)
        
        service = get_attack_service()
        result = service.simulate_replay_attack(vin, iterations)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@attack_bp.route('/idor', methods=['POST'])
def simulate_idor_attack():
    """
    Simulate IDOR Attack
    
    Body:
    {
        "victim_vin": "5YJ3E1EA1KF000001",
        "attacker_vin": "ATTACKER_VIN"
    }
    """
    try:
        data = request.get_json() or {}
        victim_vin = data.get('victim_vin', '5YJ3E1EA1KF000001')
        attacker_vin = data.get('attacker_vin', 'ATTACKER_VIN')
        
        service = get_attack_service()
        result = service.simulate_idor_attack(victim_vin, attacker_vin)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@attack_bp.route('/broken-authentication', methods=['POST'])
def simulate_broken_authentication_attack():
    """
    Simulate Broken Authentication Attack
    
    Body:
    {
        "vin": "5YJ3E1EA1KF000001"
    }
    """
    try:
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        
        service = get_attack_service()
        result = service.simulate_broken_authentication_attack(vin)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@attack_bp.route('/excessive-data-exposure', methods=['POST'])
def simulate_excessive_data_exposure_attack():
    """
    Simulate Excessive Data Exposure Attack
    
    Body:
    {
        "vin": "5YJ3E1EA1KF000001"
    }
    """
    try:
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        
        service = get_attack_service()
        result = service.simulate_excessive_data_exposure_attack(vin)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@attack_bp.route('/rate-limiting-failure', methods=['POST'])
def simulate_rate_limiting_failure_attack():
    """
    Simulate Rate Limiting Failure Attack
    
    Body:
    {
        "vin": "5YJ3E1EA1KF000001",
        "burst_count": 30
    }
    """
    try:
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        burst_count = data.get('burst_count', 30)
        
        service = get_attack_service()
        result = service.simulate_rate_limiting_failure_attack(vin, burst_count)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@attack_bp.route('/ota-manipulation', methods=['POST'])
def simulate_ota_manipulation_attack():
    """
    Simulate OTA Manipulation Attack
    
    Body:
    {
        "vin": "5YJ3E1EA1KF000001"
    }
    """
    try:
        data = request.get_json() or {}
        vin = data.get('vin', '5YJ3E1EA1KF000001')
        
        service = get_attack_service()
        result = service.simulate_ota_manipulation_attack(vin)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@attack_bp.route('/status/<attack_id>', methods=['GET'])
def get_attack_status(attack_id):
    """Get status of attack by ID"""
    try:
        service = get_attack_service()
        result = service.get_attack_status(attack_id)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@attack_bp.route('/list', methods=['GET'])
def list_available_attacks():
    """List all available attack types"""
    attacks = [
        {
            'id': 'replay',
            'name': 'Replay Attack',
            'description': 'Re-send captured vehicle commands',
            'endpoint': '/api/attacks/replay',
            'method': 'POST',
            'can_traffic': 'Repeated identical frames (0x321)',
            'severity': 'high'
        },
        {
            'id': 'idor',
            'name': 'IDOR (Insecure Direct Object Reference)',
            'description': 'Unauthorized access to another vehicle',
            'endpoint': '/api/attacks/idor',
            'method': 'POST',
            'can_traffic': 'Unauthorized unlock + GPS (0x321, 0x500)',
            'severity': 'critical'
        },
        {
            'id': 'broken_authentication',
            'name': 'Broken Authentication',
            'description': 'Execute commands without authentication',
            'endpoint': '/api/attacks/broken-authentication',
            'method': 'POST',
            'can_traffic': 'Multiple ECUs (0x321, 0x320, 0x322, 0x400)',
            'severity': 'critical'
        },
        {
            'id': 'excessive_data_exposure',
            'name': 'Excessive Data Exposure',
            'description': 'Access sensitive vehicle telemetry',
            'endpoint': '/api/attacks/excessive-data-exposure',
            'method': 'POST',
            'can_traffic': 'GPS telemetry queries (0x500)',
            'severity': 'medium'
        },
        {
            'id': 'rate_limiting_failure',
            'name': 'Rate Limiting Failure',
            'description': 'Flood vehicle APIs with requests',
            'endpoint': '/api/attacks/rate-limiting-failure',
            'method': 'POST',
            'can_traffic': 'High-frequency burst (30+ frames)',
            'severity': 'high'
        },
        {
            'id': 'ota_manipulation',
            'name': 'OTA Manipulation',
            'description': 'Malicious firmware update',
            'endpoint': '/api/attacks/ota-manipulation',
            'method': 'POST',
            'can_traffic': 'OTA sequence (0x700, 0x600)',
            'severity': 'critical'
        }
    ]
    
    return jsonify({
        'success': True,
        'count': len(attacks),
        'attacks': attacks
    }), 200
