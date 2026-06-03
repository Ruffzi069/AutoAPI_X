"""
CAN Service for AutoAPI-X
Manages CAN frame generation and logging
"""

from can_manager.socketcan_manager import SocketCANManager
from services.logging_service import LoggingService

class CANService:
    """Service layer for CAN operations"""
    
    def __init__(self, socketio=None):
        """Initialize CAN service"""
        self.can_manager = SocketCANManager()
        self.logging_service = LoggingService(socketio)
        self.socketio = socketio
    
    def send_door_lock(self, vin: str, transaction_id: str = None):
        """Send door lock CAN frame"""
        frame_data = self.can_manager.send_door_lock()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_DOOR_LOCK', f'Door lock command sent for VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_door_unlock(self, vin: str, transaction_id: str = None):
        """Send door unlock CAN frame"""
        frame_data = self.can_manager.send_door_unlock()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_DOOR_UNLOCK', f'Door unlock command sent for VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_boot_open(self, vin: str, transaction_id: str = None):
        """Send boot open CAN frame"""
        frame_data = self.can_manager.send_boot_open()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_BOOT_OPEN', f'Boot open command sent for VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_boot_close(self, vin: str, transaction_id: str = None):
        """Send boot close CAN frame"""
        frame_data = self.can_manager.send_boot_close()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_BOOT_CLOSE', f'Boot close command sent for VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_engine_start(self, vin: str, transaction_id: str = None):
        """Send engine start CAN frame"""
        frame_data = self.can_manager.send_engine_start()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_ENGINE_START', f'Engine start command sent for VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_engine_stop(self, vin: str, transaction_id: str = None):
        """Send engine stop CAN frame"""
        frame_data = self.can_manager.send_engine_stop()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_ENGINE_STOP', f'Engine stop command sent for VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_horn(self, vin: str, duration_ms: int = 1000, transaction_id: str = None):
        """Send horn activation CAN frame"""
        frame_data = self.can_manager.send_horn(duration_ms)
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_HORN', f'Horn activated for VIN: {vin} (duration: {duration_ms}ms)', 'info', transaction_id)
        return frame_data
    
    def send_horn_activate(self, vin: str, transaction_id: str = None):
        """Send horn activation CAN frame (alias)"""
        return self.send_horn(vin, 2000, transaction_id)
    
    def send_lights_flash(self, vin: str, transaction_id: str = None):
        """Send lights flash CAN frame"""
        frame_data = self.can_manager.send_lights_flash()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_LIGHTS_FLASH', f'Lights flashing for VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_gps_locate(self, vin: str, transaction_id: str = None):
        """Send GPS locate CAN frame"""
        frame_data = self.can_manager.send_gps_locate()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_GPS_LOCATE', f'GPS locate requested for VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_lights_on(self, vin: str, transaction_id: str = None):
        """Send lights on CAN frame"""
        frame_data = self.can_manager.send_lights_on()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_LIGHTS_ON', f'Lights turned on for VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_lights_off(self, vin: str, transaction_id: str = None):
        """Send lights off CAN frame"""
        frame_data = self.can_manager.send_lights_off()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_LIGHTS_OFF', f'Lights turned off for VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    # Media Methods
    def send_media_play(self, vin: str, platform: str = 'spotify', transaction_id: str = None):
        """Send media play CAN frame"""
        frame_data = self.can_manager.send_media_play(platform)
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_MEDIA_PLAY', f'Media play command - {platform} - VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_media_pause(self, vin: str, transaction_id: str = None):
        """Send media pause CAN frame"""
        frame_data = self.can_manager.send_media_pause()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_MEDIA_PAUSE', f'Media pause command - VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_media_next(self, vin: str, transaction_id: str = None):
        """Send media next track CAN frame"""
        frame_data = self.can_manager.send_media_next()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_MEDIA_NEXT', f'Media next track - VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_media_previous(self, vin: str, transaction_id: str = None):
        """Send media previous track CAN frame"""
        frame_data = self.can_manager.send_media_previous()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_MEDIA_PREVIOUS', f'Media previous track - VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_media_volume_up(self, vin: str, amount: int = 5, transaction_id: str = None):
        """Send media volume up CAN frame"""
        frame_data = self.can_manager.send_media_volume_up(amount)
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_MEDIA_VOLUME_UP', f'Volume up +{amount}% - VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_media_volume_down(self, vin: str, amount: int = 5, transaction_id: str = None):
        """Send media volume down CAN frame"""
        frame_data = self.can_manager.send_media_volume_down(amount)
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_MEDIA_VOLUME_DOWN', f'Volume down -{amount}% - VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    # Navigation Methods
    def send_nav_start(self, vin: str, transaction_id: str = None):
        """Send navigation start CAN frame"""
        frame_data = self.can_manager.send_nav_start()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_NAV_START', f'Navigation started - VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_nav_stop(self, vin: str, transaction_id: str = None):
        """Send navigation stop CAN frame"""
        frame_data = self.can_manager.send_nav_stop()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_NAV_STOP', f'Navigation stopped - VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    # OTA Methods
    def send_ota_check(self, vin: str, transaction_id: str = None):
        """Send OTA check CAN frame"""
        frame_data = self.can_manager.send_ota_check()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_OTA_CHECK', f'OTA check - VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_ota_download(self, vin: str, transaction_id: str = None):
        """Send OTA download CAN frame"""
        frame_data = self.can_manager.send_ota_download()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_OTA_DOWNLOAD', f'OTA download started - VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_ota_install(self, vin: str, transaction_id: str = None):
        """Send OTA install CAN frame"""
        frame_data = self.can_manager.send_ota_install()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'warning')
            self.logging_service.log_event('CAN_OTA_INSTALL', f'OTA install started - VIN: {vin}', 'warning', transaction_id)
        return frame_data
    
    # Phone Methods
    def send_phone_sync(self, vin: str, transaction_id: str = None):
        """Send phone sync CAN frame"""
        frame_data = self.can_manager.send_phone_sync()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_PHONE_SYNC', f'Phone synced - VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def send_phone_disconnect(self, vin: str, transaction_id: str = None):
        """Send phone disconnect CAN frame"""
        frame_data = self.can_manager.send_phone_disconnect()
        if frame_data:
            self.logging_service.log_can_event(frame_data, transaction_id, 'info')
            self.logging_service.log_event('CAN_PHONE_DISCONNECT', f'Phone disconnected - VIN: {vin}', 'info', transaction_id)
        return frame_data
    
    def close(self):
        """Close CAN manager"""
        self.can_manager.close()
