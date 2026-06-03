"""
Messaging Service for AutoAPI-X
Manages vehicle messages and notifications
"""

from typing import Dict

class MessagingService:
    """Service layer for messaging operations"""
    
    def __init__(self, socketio=None):
        """Initialize messaging service"""
        self.socketio = socketio
        
        # Messages
        self.messages = [
            {'sender': 'Tesla Service', 'preview': 'Your vehicle service is due in 2 weeks', 'time': '2 hours ago', 'unread': True},
            {'sender': 'John Doe', 'preview': 'Hey, are you free for lunch?', 'time': '5 hours ago', 'unread': True},
            {'sender': 'Calendar', 'preview': 'Reminder: Meeting at 3 PM', 'time': 'Yesterday', 'unread': False},
        ]
    
    def get_messages(self) -> Dict:
        """Get recent messages"""
        return {'success': True, 'messages': self.messages}
    
    def get_unread_count(self) -> Dict:
        """Get unread message count"""
        unread = sum(1 for m in self.messages if m['unread'])
        return {'success': True, 'unread_count': unread}
