"""
Weather Service for AutoAPI-X
Provides weather information
"""

from typing import Dict
import random

class WeatherService:
    """Service layer for weather operations"""
    
    def __init__(self, socketio=None):
        """Initialize weather service"""
        self.socketio = socketio
        
        # Weather state
        self.state = {
            'temperature': 72,
            'condition': 'Partly Cloudy',
            'humidity': 65,
            'wind_speed': 8,
            'location': 'Palo Alto, CA',
            'icon': '⛅'
        }
    
    def get_current_weather(self) -> Dict:
        """Get current weather"""
        return {'success': True, 'weather': self.state.copy()}
    
    def get_forecast(self) -> Dict:
        """Get weather forecast"""
        forecast = [
            {'day': 'Today', 'high': 75, 'low': 58, 'condition': 'Partly Cloudy', 'icon': '⛅'},
            {'day': 'Tomorrow', 'high': 78, 'low': 60, 'condition': 'Sunny', 'icon': '☀️'},
            {'day': 'Wednesday', 'high': 72, 'low': 56, 'condition': 'Cloudy', 'icon': '☁️'},
        ]
        return {'success': True, 'forecast': forecast}
