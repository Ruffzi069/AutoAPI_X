"""
Telemetry Service for AutoAPI-X
Transaction correlation and telemetry intelligence
"""

import uuid
from datetime import datetime
from typing import Optional, Dict, List
from database.database import get_db_connection

class TelemetryService:
    """Centralized telemetry and transaction correlation service"""
    
    def __init__(self, socketio=None):
        """Initialize telemetry service with optional SocketIO"""
        self.socketio = socketio
    
    @staticmethod
    def generate_transaction_id() -> str:
        """Generate unique transaction ID"""
        return f"TXN-{uuid.uuid4().hex[:8].upper()}"
    
    def correlate_transaction(self, transaction_id: str) -> Optional[Dict]:
        """Correlate all events for a given transaction ID"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get API log
        cursor.execute('''
            SELECT * FROM api_logs 
            WHERE transaction_id = ?
            ORDER BY timestamp DESC LIMIT 1
        ''', (transaction_id,))
        api_log = cursor.fetchone()
        
        # Get CAN frames
        cursor.execute('''
            SELECT * FROM can_logs 
            WHERE transaction_id = ?
            ORDER BY timestamp ASC
        ''', (transaction_id,))
        can_frames = cursor.fetchall()
        
        # Get events
        cursor.execute('''
            SELECT * FROM event_logs 
            WHERE transaction_id = ?
            ORDER BY timestamp ASC
        ''', (transaction_id,))
        events = cursor.fetchall()
        
        conn.close()
        
        if not api_log:
            return None
        
        # Calculate duration
        start_time = datetime.fromisoformat(api_log['timestamp'])
        end_time = datetime.fromisoformat(events[-1]['timestamp']) if events else start_time
        duration_ms = int((end_time - start_time).total_seconds() * 1000)
        
        return {
            'transaction_id': transaction_id,
            'api_log': dict(api_log) if api_log else None,
            'can_frames': [dict(frame) for frame in can_frames],
            'events': [dict(event) for event in events],
            'duration_ms': duration_ms,
            'start_time': api_log['timestamp'],
            'end_time': events[-1]['timestamp'] if events else api_log['timestamp']
        }
    
    def get_telemetry_summary(self) -> Dict:
        """Get aggregated telemetry statistics"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # API statistics
        cursor.execute('SELECT COUNT(*) as count FROM api_logs')
        api_count = cursor.fetchone()['count']
        
        cursor.execute('''
            SELECT AVG(CAST(
                (julianday(timestamp) - julianday('now')) * 86400000 AS INTEGER
            )) as avg_latency FROM api_logs WHERE status_code >= 200 AND status_code < 300
        ''')
        avg_latency = cursor.fetchone()['avg_latency'] or 0
        
        # CAN statistics
        cursor.execute('SELECT COUNT(*) as count FROM can_logs')
        can_count = cursor.fetchone()['count']
        
        # Event statistics
        cursor.execute('SELECT COUNT(*) as count FROM event_logs')
        event_count = cursor.fetchone()['count']
        
        # Recent activity (last 5 minutes)
        cursor.execute('''
            SELECT COUNT(*) as count FROM api_logs 
            WHERE datetime(timestamp) > datetime('now', '-5 minutes')
        ''')
        recent_api = cursor.fetchone()['count']
        
        conn.close()
        
        return {
            'timestamp': datetime.now().isoformat(),
            'api_requests': {
                'total': api_count,
                'recent_5min': recent_api,
                'avg_latency_ms': int(abs(avg_latency)) if avg_latency else 0
            },
            'can_frames': {
                'total': can_count
            },
            'events': {
                'total': event_count
            },
            'system_health': self._calculate_system_health(api_count, can_count, avg_latency)
        }
    
    def _calculate_system_health(self, api_count: int, can_count: int, avg_latency: float) -> str:
        """Calculate overall system health"""
        latency = abs(avg_latency) if avg_latency else 0
        
        if latency < 50 and api_count > 0:
            return 'excellent'
        elif latency < 100:
            return 'good'
        elif latency < 200:
            return 'fair'
        else:
            return 'poor'
    
    def emit_telemetry_update(self):
        """Emit aggregated telemetry update via SocketIO"""
        if self.socketio:
            summary = self.get_telemetry_summary()
            self.socketio.emit('telemetry_updates', summary)
    
    def get_recent_transactions(self, limit: int = 20) -> List[str]:
        """Get list of recent transaction IDs"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT DISTINCT transaction_id 
            FROM api_logs 
            WHERE transaction_id IS NOT NULL
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (limit,))
        
        transactions = [row['transaction_id'] for row in cursor.fetchall()]
        conn.close()
        
        return transactions
