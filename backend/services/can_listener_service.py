"""
CAN Listener Service for AutoAPI-X
Processes incoming CAN frames from vcan0 and updates vehicle state
"""

from database.database import get_db_connection
from datetime import datetime

class CANListenerService:
    """Service to process incoming CAN frames and update vehicle state"""
    
    # ECU to Command Mapping
    ECU_DOOR = 0x321
    ECU_HORN = 0x320
    ECU_LIGHTS = 0x322
    ECU_BOOT = 0x330
    ECU_IGNITION = 0x400
    ECU_GPS = 0x500
    ECU_INFOTAINMENT = 0x600
    ECU_OTA = 0x700
    
    def __init__(self, socketio=None):
        """Initialize CAN listener service"""
        self.socketio = socketio
    
    def process_frame(self, can_id, data, timestamp):
        """
        Process incoming CAN frame and update vehicle state
        
        Args:
            can_id: CAN frame ID (int)
            data: CAN frame data (bytes, 8 bytes)
            timestamp: Frame timestamp (float)
        """
        try:
            # Convert data to list for easier access
            payload = list(data)
            
            # Log received frame
            print(f"✓ CAN Frame Received: ID=0x{can_id:03X} Data={data.hex()}")
            
            # Process based on CAN ID
            if can_id == self.ECU_DOOR:
                self._process_door_command(payload)
            elif can_id == self.ECU_HORN:
                self._process_horn_command(payload)
            elif can_id == self.ECU_LIGHTS:
                self._process_lights_command(payload)
            elif can_id == self.ECU_BOOT:
                self._process_boot_command(payload)
            elif can_id == self.ECU_IGNITION:
                self._process_ignition_command(payload)
            elif can_id == self.ECU_GPS:
                self._process_gps_command(payload)
            elif can_id == self.ECU_INFOTAINMENT:
                self._process_infotainment_command(payload)
            elif can_id == self.ECU_OTA:
                self._process_ota_command(payload)
            else:
                print(f"⚠ Unknown CAN ID: 0x{can_id:03X}")
        
        except Exception as e:
            print(f"✗ Error processing CAN frame: {e}")
    
    def _process_door_command(self, payload):
        """Process door lock/unlock commands"""
        cmd = payload[0]
        
        if cmd == 0x01:  # Lock
            self._update_vehicle_state({'doors_status': 'locked'})
            print("  → Doors: LOCKED")
        elif cmd == 0x02:  # Unlock
            self._update_vehicle_state({'doors_status': 'unlocked'})
            print("  → Doors: UNLOCKED")
    
    def _process_horn_command(self, payload):
        """Process horn commands"""
        cmd = payload[0]
        
        if cmd == 0x01:  # Horn activate
            self._update_vehicle_state({'horn_status': 'active'})
            print("  → Horn: ACTIVE")
            
            # Reset horn after 2 seconds
            import threading
            def reset_horn():
                self._update_vehicle_state({'horn_status': 'off'})
            threading.Timer(2.0, reset_horn).start()
    
    def _process_lights_command(self, payload):
        """Process lights commands"""
        cmd = payload[0]
        
        if cmd == 0x00:  # Lights off
            self._update_vehicle_state({'lights_status': 'off'})
            print("  → Lights: OFF")
        elif cmd == 0x01:  # Lights on/flash
            self._update_vehicle_state({'lights_status': 'flashing'})
            print("  → Lights: FLASHING")
            
            # Reset lights after 3 seconds
            import threading
            def reset_lights():
                self._update_vehicle_state({'lights_status': 'off'})
            threading.Timer(3.0, reset_lights).start()
    
    def _process_boot_command(self, payload):
        """Process boot open/close commands"""
        cmd = payload[0]
        
        if cmd == 0x00:  # Close
            self._update_vehicle_state({'boot_status': 'closed'})
            print("  → Boot: CLOSED")
        elif cmd == 0x01:  # Open
            self._update_vehicle_state({'boot_status': 'open'})
            print("  → Boot: OPEN")
    
    def _process_ignition_command(self, payload):
        """Process engine start/stop commands"""
        cmd = payload[0]
        
        if cmd == 0x00:  # Stop
            self._update_vehicle_state({'engine_status': 'off'})
            print("  → Engine: OFF")
        elif cmd == 0x01:  # Start
            self._update_vehicle_state({'engine_status': 'running'})
            print("  → Engine: RUNNING")
    
    def _process_gps_command(self, payload):
        """Process GPS commands"""
        # Check if it's "GPS" in ASCII (0x47 0x50 0x53)
        if payload[0] == 0x47 and payload[1] == 0x50 and payload[2] == 0x53:
            self._update_vehicle_state({'gps_status': 'tracking'})
            print("  → GPS: TRACKING")
            
            # Reset GPS after 5 seconds
            import threading
            def reset_gps():
                self._update_vehicle_state({'gps_status': 'active'})
            threading.Timer(5.0, reset_gps).start()
        elif payload[0] == 0x01:  # GPS activate
            self._update_vehicle_state({'gps_status': 'active'})
            print("  → GPS: ACTIVE")
        elif payload[0] == 0x00:  # GPS deactivate
            self._update_vehicle_state({'gps_status': 'inactive'})
            print("  → GPS: INACTIVE")
    
    def _process_infotainment_command(self, payload):
        """Process infotainment commands"""
        cmd = payload[0]
        
        if cmd == 0x10:  # Media play
            print("  → Media: PLAY")
        elif cmd == 0x11:  # Media pause
            print("  → Media: PAUSE")
        elif cmd == 0x12:  # Media next
            print("  → Media: NEXT TRACK")
        elif cmd == 0x13:  # Media previous
            print("  → Media: PREVIOUS TRACK")
        elif cmd == 0x14:  # Volume up
            amount = payload[1]
            print(f"  → Volume: UP +{amount}")
        elif cmd == 0x15:  # Volume down
            amount = payload[1]
            print(f"  → Volume: DOWN -{amount}")
        elif cmd == 0x40:  # Phone sync
            print("  → Phone: SYNCED")
        elif cmd == 0x41:  # Phone disconnect
            print("  → Phone: DISCONNECTED")
    
    def _process_ota_command(self, payload):
        """Process OTA commands"""
        cmd = payload[0]
        
        if cmd == 0x30:  # OTA check
            print("  → OTA: CHECK FOR UPDATES")
        elif cmd == 0x31:  # OTA download
            print("  → OTA: DOWNLOADING")
        elif cmd == 0x32:  # OTA install
            print("  → OTA: INSTALLING")
    
    def _update_vehicle_state(self, updates):
        """Update vehicle state in database and emit SocketIO update"""
        try:
            # Get first vehicle (for simplicity, update all vehicles)
            # In production, you'd parse VIN from CAN frame or use context
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Build dynamic UPDATE query
            set_clause = ', '.join([f"{key} = ?" for key in updates.keys()])
            values = list(updates.values())
            
            cursor.execute(f'''
                UPDATE vehicles
                SET {set_clause}
            ''', values)
            
            conn.commit()
            
            # Get updated vehicle
            cursor.execute('SELECT * FROM vehicles LIMIT 1')
            row = cursor.fetchone()
            conn.close()
            
            if row and self.socketio:
                # Emit SocketIO update
                vehicle_data = {
                    'id': row[0],
                    'vin': row[1],
                    'owner': row[2],
                    'doors_status': row[3],
                    'engine_status': row[4],
                    'lights_status': row[5],
                    'boot_status': row[6],
                    'horn_status': row[7],
                    'gps_status': row[8],
                    'battery': row[9],
                    'network_status': row[10],
                    'infotainment_status': row[11],
                    'firmware_version': row[12],
                    'created_at': row[13]
                }
                self.socketio.emit('vehicle_updates', vehicle_data)
        
        except Exception as e:
            print(f"✗ Error updating vehicle state: {e}")
