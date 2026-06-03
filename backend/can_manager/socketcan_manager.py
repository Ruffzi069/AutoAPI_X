"""
SocketCAN Manager for AutoAPI-X
Handles CAN frame generation and transmission over vcan0
Windows-compatible with simulation fallback
"""

import struct
import platform
from datetime import datetime
from typing import Optional

# Try to import python-can, but don't fail if not available (Windows)
try:
    import can
    CAN_AVAILABLE = True
except ImportError:
    CAN_AVAILABLE = False
    print("⚠ Warning: python-can not available or SocketCAN not supported on this platform")
    print("  CAN functionality will be simulated (this is normal on Windows)")

class SocketCANManager:
    """Manages SocketCAN interface for vehicle CAN bus simulation"""
    
    # ECU Mappings (Updated to match specification)
    ECU_DOOR = 0x321        # Door lock/unlock
    ECU_HORN = 0x320        # Horn
    ECU_LIGHTS = 0x322      # Flash lights
    ECU_BOOT = 0x330        # Boot open/close
    ECU_IGNITION = 0x400    # Engine start/stop
    ECU_GPS = 0x500         # GPS/Locate vehicle
    ECU_INFOTAINMENT = 0x600  # Infotainment events
    ECU_OTA = 0x700         # OTA events
    
    # Command codes (Updated to match specification)
    CMD_LOCK = 0x01
    CMD_UNLOCK = 0x02
    CMD_HORN_ON = 0x01
    CMD_LIGHTS_FLASH = 0x01
    CMD_BOOT_OPEN = 0x01
    CMD_BOOT_CLOSE = 0x00
    CMD_ENGINE_START = 0x01
    CMD_ENGINE_STOP = 0x00
    # GPS locate uses ASCII "GPS" in payload
    
    # Media commands
    CMD_MEDIA_PLAY = 0x10
    CMD_MEDIA_PAUSE = 0x11
    CMD_MEDIA_NEXT = 0x12
    CMD_MEDIA_PREVIOUS = 0x13
    CMD_MEDIA_VOLUME_UP = 0x14
    CMD_MEDIA_VOLUME_DOWN = 0x15
    
    # Navigation commands
    CMD_NAV_START = 0x20
    CMD_NAV_STOP = 0x21
    CMD_NAV_UPDATE = 0x22
    
    # OTA commands
    CMD_OTA_CHECK = 0x30
    CMD_OTA_DOWNLOAD = 0x31
    CMD_OTA_INSTALL = 0x32
    
    # Phone commands
    CMD_PHONE_SYNC = 0x40
    CMD_PHONE_DISCONNECT = 0x41
    
    def __init__(self, interface='vcan0'):
        """Initialize SocketCAN manager"""
        self.interface = interface
        self.bus = None
        self.simulation_mode = True
        self.initialize()
    
    def initialize(self):
        """Initialize CAN bus connection"""
        # Check if we're on Windows
        if platform.system() == 'Windows':
            print(f"✓ Running on Windows - CAN simulation mode enabled")
            print(f"  All CAN frames will be logged but not sent to physical interface")
            self.simulation_mode = True
            self.bus = None
            return True
        
        # Try to initialize real CAN interface (Linux)
        if not CAN_AVAILABLE:
            print(f"⚠ python-can not available - CAN simulation mode enabled")
            self.simulation_mode = True
            self.bus = None
            return True
        
        try:
            self.bus = can.Bus(interface='socketcan', channel=self.interface, bitrate=500000)
            print(f"✓ CAN interface '{self.interface}' initialized successfully")
            self.simulation_mode = False
            return True
        except Exception as e:
            print(f"⚠ Warning: Could not initialize CAN interface '{self.interface}': {e}")
            print("  CAN functionality will be simulated without actual hardware")
            self.simulation_mode = True
            self.bus = None
            return False
    
    def send_frame(self, can_id: int, data: bytes, source_ecu: str, destination_ecu: str):
        """Send a CAN frame (or simulate on Windows)"""
        try:
            if self.bus and not self.simulation_mode:
                # Real CAN interface available (Linux with vcan0)
                message = can.Message(
                    arbitration_id=can_id,
                    data=data,
                    is_extended_id=False
                )
                self.bus.send(message)
                print(f"✓ CAN Frame Sent: ID=0x{can_id:03X} Data={data.hex()} ({source_ecu} → {destination_ecu})")
            else:
                # Simulation mode (Windows or no CAN interface)
                print(f"✓ CAN Frame [SIM]: ID=0x{can_id:03X} Data={data.hex()} ({source_ecu} → {destination_ecu})")
            
            return {
                'can_id': f"0x{can_id:03X}",
                'source_ecu': source_ecu,
                'destination_ecu': destination_ecu,
                'payload': data.hex(),
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            print(f"✗ Error sending CAN frame: {e}")
            # Even on error, return simulated frame data for logging
            return {
                'can_id': f"0x{can_id:03X}",
                'source_ecu': source_ecu,
                'destination_ecu': destination_ecu,
                'payload': data.hex(),
                'timestamp': datetime.now().isoformat()
            }
    
    def send_door_lock(self):
        """Send door lock command"""
        data = bytes([self.CMD_LOCK, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_DOOR, data, 'API_Gateway', 'Door_ECU')
    
    def send_door_unlock(self):
        """Send door unlock command"""
        data = bytes([self.CMD_UNLOCK, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_DOOR, data, 'API_Gateway', 'Door_ECU')
    
    def send_boot_open(self):
        """Send boot open command"""
        data = bytes([self.CMD_BOOT_OPEN, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_BOOT, data, 'API_Gateway', 'Boot_ECU')
    
    def send_boot_close(self):
        """Send boot close command"""
        data = bytes([self.CMD_BOOT_CLOSE, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_BOOT, data, 'API_Gateway', 'Boot_ECU')
    
    def send_engine_start(self):
        """Send engine start command"""
        data = bytes([self.CMD_ENGINE_START, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_IGNITION, data, 'API_Gateway', 'Ignition_ECU')
    
    def send_engine_stop(self):
        """Send engine stop command"""
        data = bytes([self.CMD_ENGINE_STOP, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_IGNITION, data, 'API_Gateway', 'Ignition_ECU')
    
    def send_horn(self, duration_ms: int = 1000):
        """Send horn activation command"""
        data = bytes([self.CMD_HORN_ON, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_HORN, data, 'API_Gateway', 'Horn_ECU')
    
    def send_lights_on(self):
        """Send lights on command"""
        data = bytes([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_LIGHTS, data, 'API_Gateway', 'Lights_ECU')
    
    def send_lights_off(self):
        """Send lights off command"""
        data = bytes([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_LIGHTS, data, 'API_Gateway', 'Lights_ECU')
    
    def send_lights_flash(self):
        """Send lights flash command"""
        data = bytes([self.CMD_LIGHTS_FLASH, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_LIGHTS, data, 'API_Gateway', 'Lights_ECU')
    
    def send_gps_locate(self):
        """Send GPS locate command - uses ASCII 'GPS' in payload"""
        # Payload: "GPS" in ASCII = 0x47 0x50 0x53
        data = bytes([0x47, 0x50, 0x53, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_GPS, data, 'API_Gateway', 'GPS_ECU')
    
    def send_gps_activate(self):
        """Send GPS activation command"""
        data = bytes([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_GPS, data, 'API_Gateway', 'GPS_ECU')
    
    def send_gps_deactivate(self):
        """Send GPS deactivation command"""
        data = bytes([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_GPS, data, 'API_Gateway', 'GPS_ECU')
    
    def send_infotainment_online(self):
        """Send infotainment online command"""
        data = bytes([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_INFOTAINMENT, data, 'API_Gateway', 'Infotainment_ECU')
    
    def send_infotainment_offline(self):
        """Send infotainment offline command"""
        data = bytes([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_INFOTAINMENT, data, 'API_Gateway', 'Infotainment_ECU')
    
    # Media Control Methods
    def send_media_play(self, platform: str = 'spotify'):
        """Send media play command"""
        platform_byte = 0x01 if platform == 'spotify' else 0x02
        data = bytes([self.CMD_MEDIA_PLAY, platform_byte, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_INFOTAINMENT, data, 'API_Gateway', 'Infotainment_ECU')
    
    def send_media_pause(self):
        """Send media pause command"""
        data = bytes([self.CMD_MEDIA_PAUSE, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_INFOTAINMENT, data, 'API_Gateway', 'Infotainment_ECU')
    
    def send_media_next(self):
        """Send media next track command"""
        data = bytes([self.CMD_MEDIA_NEXT, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_INFOTAINMENT, data, 'API_Gateway', 'Infotainment_ECU')
    
    def send_media_previous(self):
        """Send media previous track command"""
        data = bytes([self.CMD_MEDIA_PREVIOUS, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_INFOTAINMENT, data, 'API_Gateway', 'Infotainment_ECU')
    
    def send_media_volume_up(self, amount: int = 5):
        """Send media volume up command"""
        data = bytes([self.CMD_MEDIA_VOLUME_UP, amount, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_INFOTAINMENT, data, 'API_Gateway', 'Infotainment_ECU')
    
    def send_media_volume_down(self, amount: int = 5):
        """Send media volume down command"""
        data = bytes([self.CMD_MEDIA_VOLUME_DOWN, amount, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_INFOTAINMENT, data, 'API_Gateway', 'Infotainment_ECU')
    
    # Navigation Methods
    def send_nav_start(self):
        """Send navigation start command"""
        data = bytes([self.CMD_NAV_START, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_GPS, data, 'API_Gateway', 'GPS_ECU')
    
    def send_nav_stop(self):
        """Send navigation stop command"""
        data = bytes([self.CMD_NAV_STOP, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_GPS, data, 'API_Gateway', 'GPS_ECU')
    
    def send_nav_update(self):
        """Send navigation update command"""
        data = bytes([self.CMD_NAV_UPDATE, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_GPS, data, 'API_Gateway', 'GPS_ECU')
    
    # OTA Methods
    def send_ota_check(self):
        """Send OTA check for updates command"""
        data = bytes([self.CMD_OTA_CHECK, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_OTA, data, 'API_Gateway', 'OTA_ECU')
    
    def send_ota_download(self):
        """Send OTA download command"""
        data = bytes([self.CMD_OTA_DOWNLOAD, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_OTA, data, 'API_Gateway', 'OTA_ECU')
    
    def send_ota_install(self):
        """Send OTA install command"""
        data = bytes([self.CMD_OTA_INSTALL, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_OTA, data, 'API_Gateway', 'OTA_ECU')
    
    # Phone Methods
    def send_phone_sync(self):
        """Send phone sync command"""
        data = bytes([self.CMD_PHONE_SYNC, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_INFOTAINMENT, data, 'API_Gateway', 'Infotainment_ECU')
    
    def send_phone_disconnect(self):
        """Send phone disconnect command"""
        data = bytes([self.CMD_PHONE_DISCONNECT, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
        return self.send_frame(self.ECU_INFOTAINMENT, data, 'API_Gateway', 'Infotainment_ECU')
    
    def start_listening(self, callback):
        """
        Start listening for incoming CAN frames
        
        Args:
            callback: Function to call when frame is received
                     callback(can_id, data, timestamp)
        """
        if not self.bus or self.simulation_mode:
            print("⚠ CAN listening not available (simulation mode or no bus)")
            return False
        
        import threading
        
        def listen_loop():
            print("✓ CAN listener started on vcan0")
            try:
                for message in self.bus:
                    # Call callback with frame details
                    callback(
                        can_id=message.arbitration_id,
                        data=bytes(message.data),
                        timestamp=message.timestamp
                    )
            except Exception as e:
                print(f"✗ CAN listener error: {e}")
        
        # Start listener thread
        self.listener_thread = threading.Thread(target=listen_loop, daemon=True)
        self.listener_thread.start()
        return True
    
    def close(self):
        """Close CAN bus connection"""
        if self.bus:
            self.bus.shutdown()
            print("✓ CAN interface closed")

