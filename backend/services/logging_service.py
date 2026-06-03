"""
Logging Service for AutoAPI-X
Centralized logging for API, CAN, and system events with SocketIO emission
"""

import json
from datetime import datetime
from database.database import get_db_connection

class LoggingService:
    """Centralized logging service"""
    
    def __init__(self, socketio=None):
        """Initialize logging service with optional SocketIO"""
        self.socketio = socketio
    
    def log_api_request(self, method: str, endpoint: str, request_data: dict, 
                       response_data: dict, status_code: int, transaction_id: str = None,
                       source: str = 'dashboard', user_id: str = 'User A'):
        """Log API request and response"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        timestamp = datetime.now().isoformat()
        
        cursor.execute('''
            INSERT INTO api_logs (transaction_id, method, endpoint, request_data, response_data, status_code, timestamp, source, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            transaction_id,
            method,
            endpoint,
            json.dumps(request_data) if request_data else None,
            json.dumps(response_data) if response_data else None,
            status_code,
            timestamp,
            source,
            user_id
        ))
        
        conn.commit()
        conn.close()
        
        # Emit to SocketIO
        if self.socketio:
            self.socketio.emit('api_updates', {
                'transaction_id': transaction_id,
                'timestamp': timestamp,
                'method': method,
                'endpoint': endpoint,
                'request': request_data,
                'response': response_data,
                'status': status_code,
                'latency': 0,  # Calculate if needed
                'type': 'success' if 200 <= status_code < 300 else 'error',
                'source': source,
                'user': user_id
            })
    
    def log_can_event(self, frame_data: dict, transaction_id: str = None, severity: str = 'info'):
        """Log CAN frame transmission"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        timestamp = datetime.now().isoformat()
        
        cursor.execute('''
            INSERT INTO can_logs (transaction_id, can_id, source_ecu, destination_ecu, payload, timestamp, severity)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            transaction_id,
            frame_data['can_id'],
            frame_data['source_ecu'],
            frame_data['destination_ecu'],
            frame_data['payload'],
            timestamp,
            severity
        ))
        
        conn.commit()
        conn.close()
        
        # Emit to SocketIO
        if self.socketio:
            self.socketio.emit('can_updates', {
                'transaction_id': transaction_id,
                'timestamp': timestamp,
                'can_id': frame_data['can_id'],
                'source_ecu': frame_data['source_ecu'],
                'destination_ecu': frame_data['destination_ecu'],
                'payload': frame_data['payload'],
                'message_type': 'command',
                'severity': severity
            })
    
    def log_event(self, event_type: str, description: str, severity: str = 'info', transaction_id: str = None):
        """Log system event"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        timestamp = datetime.now().isoformat()
        
        # Don't insert severity since the column doesn't exist
        cursor.execute('''
            INSERT INTO event_logs (transaction_id, event_type, description, timestamp)
            VALUES (?, ?, ?, ?)
        ''', (transaction_id, event_type, description, timestamp))
        
        conn.commit()
        conn.close()
        
        # Emit to SocketIO (still include severity for frontend)
        if self.socketio:
            self.socketio.emit('event_updates', {
                'transaction_id': transaction_id,
                'timestamp': timestamp,
                'event_type': event_type,
                'description': description,
                'severity': severity
            })
    
    def get_recent_api_logs(self, limit: int = 50):
        """Retrieve recent API logs"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM api_logs
            ORDER BY timestamp DESC
            LIMIT ?
        ''', (limit,))
        
        logs = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return logs
    
    def get_recent_can_logs(self, limit: int = 50):
        """Retrieve recent CAN logs"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM can_logs
            ORDER BY timestamp DESC
            LIMIT ?
        ''', (limit,))
        
        logs = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return logs
    
    def get_recent_event_logs(self, limit: int = 50):
        """Retrieve recent event logs"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM event_logs
            ORDER BY timestamp DESC
            LIMIT ?
        ''', (limit,))
        
        logs = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return logs
