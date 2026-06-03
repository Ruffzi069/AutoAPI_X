"""
Media Service for AutoAPI-X
Manages Spotify, YouTube Music, and other media platforms
"""

from services.can_service import CANService
from services.logging_service import LoggingService
from services.telemetry_service import TelemetryService
from typing import Dict

class MediaService:
    """Service layer for media/infotainment operations"""
    
    def __init__(self, socketio=None):
        """Initialize media service"""
        self.can_service = CANService(socketio)
        self.logging_service = LoggingService(socketio)
        self.telemetry_service = TelemetryService(socketio)
        self.socketio = socketio
        
        # Media state
        self.state = {
            'platform': 'spotify',  # spotify or youtube
            'is_playing': False,
            'current_song': 'No song playing',
            'artist': 'Unknown Artist',
            'album': 'Unknown Album',
            'duration': 0,
            'position': 0,
            'volume': 75,
            'status': 'stopped'
        }
        
        # Mock song library
        self.spotify_songs = [
            {'title': 'Blinding Lights', 'artist': 'The Weeknd', 'album': 'After Hours', 'duration': 200},
            {'title': 'Levitating', 'artist': 'Dua Lipa', 'album': 'Future Nostalgia', 'duration': 203},
            {'title': 'Save Your Tears', 'artist': 'The Weeknd', 'album': 'After Hours', 'duration': 215},
            {'title': 'Peaches', 'artist': 'Justin Bieber', 'album': 'Justice', 'duration': 198},
            {'title': 'Good 4 U', 'artist': 'Olivia Rodrigo', 'album': 'SOUR', 'duration': 178}
        ]
        
        self.youtube_songs = [
            {'title': 'Dynamite', 'artist': 'BTS', 'album': 'BE', 'duration': 199},
            {'title': 'Butter', 'artist': 'BTS', 'album': 'Butter', 'duration': 164},
            {'title': 'Bad Habits', 'artist': 'Ed Sheeran', 'album': 'Bad Habits', 'duration': 231},
            {'title': 'Stay', 'artist': 'The Kid LAROI & Justin Bieber', 'album': 'Stay', 'duration': 141},
            {'title': 'Montero', 'artist': 'Lil Nas X', 'album': 'MONTERO', 'duration': 137}
        ]
        
        self.current_playlist = self.spotify_songs
        self.current_index = 0
    
    def play(self, vin: str) -> Dict:
        """Play media"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        # Send CAN frame
        self.can_service.send_media_play(vin, self.state['platform'], txn_id)
        
        # Update state
        if not self.state['is_playing']:
            # Load current song
            song = self.current_playlist[self.current_index]
            self.state.update({
                'is_playing': True,
                'current_song': song['title'],
                'artist': song['artist'],
                'album': song['album'],
                'duration': song['duration'],
                'position': 0,
                'status': 'playing'
            })
        else:
            self.state['is_playing'] = True
            self.state['status'] = 'playing'
        
        # Log event
        self.logging_service.log_event(
            'MEDIA_PLAY',
            f"Media playback started - {self.state['platform']} - {self.state['current_song']}",
            'info',
            txn_id
        )
        
        # Broadcast update
        if self.socketio:
            self.socketio.emit('media_updates', self.state)
        
        return {
            'success': True,
            'message': 'Media playback started',
            'state': self.state.copy(),
            'transaction_id': txn_id
        }
    
    def pause(self, vin: str) -> Dict:
        """Pause media"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        # Send CAN frame
        self.can_service.send_media_pause(vin, txn_id)
        
        # Update state
        self.state['is_playing'] = False
        self.state['status'] = 'paused'
        
        # Log event
        self.logging_service.log_event(
            'MEDIA_PAUSE',
            f"Media playback paused - {self.state['current_song']}",
            'info',
            txn_id
        )
        
        # Broadcast update
        if self.socketio:
            self.socketio.emit('media_updates', self.state)
        
        return {
            'success': True,
            'message': 'Media playback paused',
            'state': self.state.copy(),
            'transaction_id': txn_id
        }
    
    def next_track(self, vin: str) -> Dict:
        """Skip to next track"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        # Send CAN frame
        self.can_service.send_media_next(vin, txn_id)
        
        # Update to next song
        self.current_index = (self.current_index + 1) % len(self.current_playlist)
        song = self.current_playlist[self.current_index]
        
        self.state.update({
            'current_song': song['title'],
            'artist': song['artist'],
            'album': song['album'],
            'duration': song['duration'],
            'position': 0,
            'is_playing': True,
            'status': 'playing'
        })
        
        # Log event
        self.logging_service.log_event(
            'MEDIA_NEXT',
            f"Next track - {self.state['current_song']} by {self.state['artist']}",
            'info',
            txn_id
        )
        
        # Broadcast update
        if self.socketio:
            self.socketio.emit('media_updates', self.state)
        
        return {
            'success': True,
            'message': 'Skipped to next track',
            'state': self.state.copy(),
            'transaction_id': txn_id
        }
    
    def previous_track(self, vin: str) -> Dict:
        """Go to previous track"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        # Send CAN frame
        self.can_service.send_media_previous(vin, txn_id)
        
        # Update to previous song
        self.current_index = (self.current_index - 1) % len(self.current_playlist)
        song = self.current_playlist[self.current_index]
        
        self.state.update({
            'current_song': song['title'],
            'artist': song['artist'],
            'album': song['album'],
            'duration': song['duration'],
            'position': 0,
            'is_playing': True,
            'status': 'playing'
        })
        
        # Log event
        self.logging_service.log_event(
            'MEDIA_PREVIOUS',
            f"Previous track - {self.state['current_song']} by {self.state['artist']}",
            'info',
            txn_id
        )
        
        # Broadcast update
        if self.socketio:
            self.socketio.emit('media_updates', self.state)
        
        return {
            'success': True,
            'message': 'Skipped to previous track',
            'state': self.state.copy(),
            'transaction_id': txn_id
        }
    
    def volume_up(self, vin: str, amount: int = 5) -> Dict:
        """Increase volume"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        # Send CAN frame
        self.can_service.send_media_volume_up(vin, amount, txn_id)
        
        # Update volume
        self.state['volume'] = min(100, self.state['volume'] + amount)
        
        # Log event
        self.logging_service.log_event(
            'MEDIA_VOLUME_UP',
            f"Volume increased to {self.state['volume']}%",
            'info',
            txn_id
        )
        
        # Broadcast update
        if self.socketio:
            self.socketio.emit('media_updates', self.state)
        
        return {
            'success': True,
            'message': f"Volume increased to {self.state['volume']}%",
            'state': self.state.copy(),
            'transaction_id': txn_id
        }
    
    def volume_down(self, vin: str, amount: int = 5) -> Dict:
        """Decrease volume"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        # Send CAN frame
        self.can_service.send_media_volume_down(vin, amount, txn_id)
        
        # Update volume
        self.state['volume'] = max(0, self.state['volume'] - amount)
        
        # Log event
        self.logging_service.log_event(
            'MEDIA_VOLUME_DOWN',
            f"Volume decreased to {self.state['volume']}%",
            'info',
            txn_id
        )
        
        # Broadcast update
        if self.socketio:
            self.socketio.emit('media_updates', self.state)
        
        return {
            'success': True,
            'message': f"Volume decreased to {self.state['volume']}%",
            'state': self.state.copy(),
            'transaction_id': txn_id
        }
    
    def set_platform(self, vin: str, platform: str) -> Dict:
        """Switch media platform"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        if platform not in ['spotify', 'youtube']:
            return {'success': False, 'message': 'Invalid platform'}
        
        # Update platform and playlist
        self.state['platform'] = platform
        self.current_playlist = self.spotify_songs if platform == 'spotify' else self.youtube_songs
        self.current_index = 0
        
        # Load first song of new platform
        song = self.current_playlist[0]
        self.state.update({
            'current_song': song['title'],
            'artist': song['artist'],
            'album': song['album'],
            'duration': song['duration'],
            'position': 0,
            'is_playing': False,
            'status': 'stopped'
        })
        
        # Log event
        self.logging_service.log_event(
            'MEDIA_PLATFORM_CHANGE',
            f"Media platform changed to {platform}",
            'info',
            txn_id
        )
        
        # Broadcast update
        if self.socketio:
            self.socketio.emit('media_updates', self.state)
        
        return {
            'success': True,
            'message': f"Platform switched to {platform}",
            'state': self.state.copy(),
            'transaction_id': txn_id
        }
    
    def get_status(self) -> Dict:
        """Get current media status"""
        return {
            'success': True,
            'state': self.state.copy()
        }
