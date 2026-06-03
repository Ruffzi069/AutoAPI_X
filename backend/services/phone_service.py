"""
Phone Service for AutoAPI-X
Manages phone connectivity and calls
"""

from services.can_service import CANService
from services.logging_service import LoggingService
from services.telemetry_service import TelemetryService
from typing import Dict

class PhoneService:
    """Service layer for phone connectivity"""
    
    def __init__(self, socketio=None):
        """Initialize phone service"""
        self.can_service = CANService(socketio)
        self.logging_service = LoggingService(socketio)
        self.telemetry_service = TelemetryService(socketio)
        self.socketio = socketio
        
        # Phone state
        self.state = {
            'connected': True,
            'device_name': 'Google Pixel 8 Pro',
            'battery': 85,
            'signal_strength': 4,
            'bluetooth_status': 'connected'
        }
        
        self.call_history = [
            {'name': 'John Doe', 'number': '+1 (555) 123-4567', 'time': '10:30 AM', 'type': 'incoming'},
            {'name': 'Jane Smith', 'number': '+1 (555) 987-6543', 'time': '9:15 AM', 'type': 'outgoing'},
            {'name': 'Bob Wilson', 'number': '+1 (555) 456-7890', 'time': 'Yesterday', 'type': 'missed'},
        ]
    
    def sync_phone(self, vin: str) -> Dict:
        """Sync phone connection"""
        txn_id = self.telemetry_service.generate_transaction_id()
        
        self.can_service.send_phone_sync(vin, txn_id)
        
        self.state['connected'] = True
        
        self.logging_service.log_event('PHONE_SYNC', f'Phone synced - {self.state["device_name"]}', 'info', txn_id)
        
        if self.socketio:
            self.socketio.emit('phone_updates', self.state)
        
        return {'success': True, 'message': 'Phone synced', 'state': self.state.copy(), 'transaction_id': txn_id}
    
    def disconnect_phone(self, vin: str) -> Dict:
        """Disconnect phone"""
        txn_id = self.telemetry_service.generate_transaction_id()
        
        self.can_service.send_phone_disconnect(vin, txn_id)
        
        self.state['connected'] = False
        
        self.logging_service.log_event('PHONE_DISCONNECT', 'Phone disconnected', 'info', txn_id)
        
        if self.socketio:
            self.socketio.emit('phone_updates', self.state)
        
        return {'success': True, 'message': 'Phone disconnected', 'state': self.state.copy(), 'transaction_id': txn_id}
    
    def get_status(self) -> Dict:
        """Get phone status"""
        return {'success': True, 'state': self.state.copy()}
    
    def get_call_history(self) -> Dict:
        """Get call history"""
        return {'success': True, 'calls': self.call_history}
