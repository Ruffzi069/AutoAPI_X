"""
Navigation Service for AutoAPI-X
Manages Maps, GPS, and navigation services
"""

from services.can_service import CANService
from services.logging_service import LoggingService
from services.telemetry_service import TelemetryService
from typing import Dict
import random

class NavigationService:
    """Service layer for navigation operations"""
    
    def __init__(self, socketio=None):
        """Initialize navigation service"""
        self.can_service = CANService(socketio)
        self.logging_service = LoggingService(socketio)
        self.telemetry_service = TelemetryService(socketio)
        self.socketio = socketio
        
        # Navigation state
        self.state = {
            'is_navigating': False,
            'destination': None,
            'current_location': 'Tesla Headquarters, Palo Alto, CA',
            'eta': None,
            'distance': 0,
            'route': [],
            'nearby_chargers': []
        }
        
        # Mock destinations
        self.destinations = [
            {'name': 'Supercharger Station - Downtown', 'distance': 5.2, 'eta': '15 min'},
            {'name': 'Golden Gate Park', 'distance': 12.8, 'eta': '28 min'},
            {'name': 'San Francisco Airport', 'distance': 18.3, 'eta': '35 min'},
            {'name': 'Apple Park', 'distance': 25.6, 'eta': '42 min'},
        ]
        
        self.nearby_chargers = [
            {'name': 'Tesla Supercharger - Market St', 'distance': 2.1, 'available': 8},
            {'name': 'Tesla Supercharger - Union Square', 'distance': 3.5, 'available': 12},
            {'name': 'ChargePoint - Bay St', 'distance': 4.2, 'available': 4},
        ]
    
    def start_navigation(self, vin: str, destination: str) -> Dict:
        """Start navigation to destination"""
        txn_id = self.telemetry_service.generate_transaction_id()
        
        # Send CAN frame
        self.can_service.send_nav_start(vin, txn_id)
        
        # Find destination
        dest = next((d for d in self.destinations if d['name'] == destination), self.destinations[0])
        
        self.state.update({
            'is_navigating': True,
            'destination': dest['name'],
            'distance': dest['distance'],
            'eta': dest['eta'],
            'route': ['Start', 'Highway 101 N', 'Exit 42', dest['name']]
        })
        
        self.logging_service.log_event('NAV_START', f'Navigation started to {dest["name"]}', 'info', txn_id)
        
        if self.socketio:
            self.socketio.emit('navigation_updates', self.state)
        
        return {'success': True, 'message': 'Navigation started', 'state': self.state.copy(), 'transaction_id': txn_id}
    
    def stop_navigation(self, vin: str) -> Dict:
        """Stop navigation"""
        txn_id = self.telemetry_service.generate_transaction_id()
        
        self.can_service.send_nav_stop(vin, txn_id)
        
        self.state['is_navigating'] = False
        
        self.logging_service.log_event('NAV_STOP', 'Navigation stopped', 'info', txn_id)
        
        if self.socketio:
            self.socketio.emit('navigation_updates', self.state)
        
        return {'success': True, 'message': 'Navigation stopped', 'state': self.state.copy(), 'transaction_id': txn_id}
    
    def get_location(self) -> Dict:
        """Get current location"""
        return {'success': True, 'location': self.state['current_location'], 'state': self.state.copy()}
    
    def get_nearby_chargers(self) -> Dict:
        """Get nearby charging stations"""
        return {'success': True, 'chargers': self.nearby_chargers}
    
    def get_status(self) -> Dict:
        """Get navigation status"""
        return {'success': True, 'state': self.state.copy()}
