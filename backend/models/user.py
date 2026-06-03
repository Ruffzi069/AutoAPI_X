"""
User Model for AutoAPI-X
"""

from dataclasses import dataclass
from typing import Optional

@dataclass
class User:
    """User model representing vehicle owners and system users"""
    
    id: int
    username: str
    role: str
    created_at: Optional[str] = None
    
    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'created_at': self.created_at
        }
    
    @staticmethod
    def from_db_row(row):
        """Create User object from database row"""
        return User(
            id=row['id'],
            username=row['username'],
            role=row['role'],
            created_at=row['created_at'] if 'created_at' in row.keys() else None
        )
