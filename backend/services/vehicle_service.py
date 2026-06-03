"""
Vehicle Service for AutoAPI-X
Manages vehicle state, CAN events, and real-time updates
"""

from database.database import get_db_connection
from models.vehicle import Vehicle
from services.can_service import CANService
from services.logging_service import LoggingService
from services.telemetry_service import TelemetryService
from typing import List, Optional

class VehicleService:
    """Service layer for vehicle operations"""
    
    def __init__(self, socketio=None):
        """Initialize vehicle service"""
        self.can_service = CANService(socketio)
        self.logging_service = LoggingService(socketio)
        self.telemetry_service = TelemetryService(socketio)
        self.socketio = socketio
    
    def get_all_vehicles(self) -> List[Vehicle]:
        """Retrieve all vehicles"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM vehicles')
        rows = cursor.fetchall()
        conn.close()
        
        return [Vehicle.from_db_row(row) for row in rows]
    
    def get_vehicle_by_vin(self, vin: str) -> Optional[Vehicle]:
        """Retrieve vehicle by VIN"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM vehicles WHERE vin = ?', (vin,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return Vehicle.from_db_row(row)
        return None
    
    def update_vehicle_state(self, vin: str, updates: dict):
        """Update vehicle state in database"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Build dynamic UPDATE query
        set_clause = ', '.join([f"{key} = ?" for key in updates.keys()])
        values = list(updates.values()) + [vin]
        
        cursor.execute(f'''
            UPDATE vehicles
            SET {set_clause}
            WHERE vin = ?
        ''', values)
        
        conn.commit()
        conn.close()
    
    def broadcast_vehicle_update(self, vehicle: Vehicle):
        """Broadcast vehicle state update via SocketIO"""
        if self.socketio:
            self.socketio.emit('vehicle_updates', vehicle.to_dict())
    
    def lock_vehicle(self, vin: str) -> dict:
        """Lock vehicle doors"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        vehicle = self.get_vehicle_by_vin(vin)
        if not vehicle:
            return {'success': False, 'message': 'Vehicle not found'}
        
        # Send CAN frame with transaction ID
        self.can_service.send_door_lock(vin, txn_id)
        
        # Update vehicle state
        vehicle.lock()
        self.update_vehicle_state(vin, {'doors_status': 'locked'})
        
        # Log event with transaction ID
        self.logging_service.log_event('VEHICLE_LOCK', f'Vehicle {vin} doors locked', 'info', txn_id)
        
        # Broadcast update
        self.broadcast_vehicle_update(vehicle)
        
        return {'success': True, 'message': 'Vehicle locked', 'vehicle': vehicle.to_dict(), 'transaction_id': txn_id}
    
    def unlock_vehicle(self, vin: str) -> dict:
        """Unlock vehicle doors"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        vehicle = self.get_vehicle_by_vin(vin)
        if not vehicle:
            return {'success': False, 'message': 'Vehicle not found'}
        
        # Send CAN frame with transaction ID
        self.can_service.send_door_unlock(vin, txn_id)
        
        # Update vehicle state
        vehicle.unlock()
        self.update_vehicle_state(vin, {'doors_status': 'unlocked'})
        
        # Log event with transaction ID
        self.logging_service.log_event('VEHICLE_UNLOCK', f'Vehicle {vin} doors unlocked', 'info', txn_id)
        
        # Broadcast update
        self.broadcast_vehicle_update(vehicle)
        
        return {'success': True, 'message': 'Vehicle unlocked', 'vehicle': vehicle.to_dict(), 'transaction_id': txn_id}
    
    def open_boot(self, vin: str) -> dict:
        """Open vehicle boot"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        vehicle = self.get_vehicle_by_vin(vin)
        if not vehicle:
            return {'success': False, 'message': 'Vehicle not found'}
        
        # Send CAN frame with transaction ID
        self.can_service.send_boot_open(vin, txn_id)
        
        # Update vehicle state
        vehicle.open_boot()
        self.update_vehicle_state(vin, {'boot_status': 'open'})
        
        # Log event with transaction ID
        self.logging_service.log_event('BOOT_OPEN', f'Vehicle {vin} boot opened', 'info', txn_id)
        
        # Broadcast update
        self.broadcast_vehicle_update(vehicle)
        
        return {'success': True, 'message': 'Boot opened', 'vehicle': vehicle.to_dict(), 'transaction_id': txn_id}
    
    def start_engine(self, vin: str) -> dict:
        """Start vehicle engine"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        vehicle = self.get_vehicle_by_vin(vin)
        if not vehicle:
            return {'success': False, 'message': 'Vehicle not found'}
        
        # Send CAN frame with transaction ID
        self.can_service.send_engine_start(vin, txn_id)
        
        # Update vehicle state
        vehicle.start_engine()
        self.update_vehicle_state(vin, {'engine_status': 'running'})
        
        # Log event with transaction ID
        self.logging_service.log_event('ENGINE_START', f'Vehicle {vin} engine started', 'info', txn_id)
        
        # Broadcast update
        self.broadcast_vehicle_update(vehicle)
        
        return {'success': True, 'message': 'Engine started', 'vehicle': vehicle.to_dict(), 'transaction_id': txn_id}
    
    def activate_horn(self, vin: str) -> dict:
        """Activate vehicle horn"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        vehicle = self.get_vehicle_by_vin(vin)
        if not vehicle:
            return {'success': False, 'message': 'Vehicle not found'}
        
        # Send CAN frame with transaction ID
        self.can_service.send_horn_activate(vin, txn_id)
        
        # Update vehicle state
        self.update_vehicle_state(vin, {'horn_status': 'active'})
        
        # Log event with transaction ID
        self.logging_service.log_event('HORN_ACTIVATE', f'Vehicle {vin} horn activated', 'info', txn_id)
        
        # Broadcast update
        vehicle.horn_status = 'active'
        self.broadcast_vehicle_update(vehicle)
        
        # Reset horn status after 2 seconds (simulated)
        import threading
        def reset_horn():
            self.update_vehicle_state(vin, {'horn_status': 'off'})
            vehicle.horn_status = 'off'
            self.broadcast_vehicle_update(vehicle)
        
        threading.Timer(2.0, reset_horn).start()
        
        return {'success': True, 'message': 'Horn activated', 'vehicle': vehicle.to_dict(), 'transaction_id': txn_id}
    
    def flash_lights(self, vin: str) -> dict:
        """Flash vehicle lights"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        vehicle = self.get_vehicle_by_vin(vin)
        if not vehicle:
            return {'success': False, 'message': 'Vehicle not found'}
        
        # Send CAN frame with transaction ID
        self.can_service.send_lights_flash(vin, txn_id)
        
        # Update vehicle state
        self.update_vehicle_state(vin, {'lights_status': 'flashing'})
        
        # Log event with transaction ID
        self.logging_service.log_event('LIGHTS_FLASH', f'Vehicle {vin} lights flashing', 'info', txn_id)
        
        # Broadcast update
        vehicle.lights_status = 'flashing'
        self.broadcast_vehicle_update(vehicle)
        
        # Reset lights after 3 seconds
        import threading
        def reset_lights():
            self.update_vehicle_state(vin, {'lights_status': 'off'})
            vehicle.lights_status = 'off'
            self.broadcast_vehicle_update(vehicle)
        
        threading.Timer(3.0, reset_lights).start()
        
        return {'success': True, 'message': 'Lights flashing', 'vehicle': vehicle.to_dict(), 'transaction_id': txn_id}
    
    def close_boot(self, vin: str) -> dict:
        """Close vehicle boot"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        vehicle = self.get_vehicle_by_vin(vin)
        if not vehicle:
            return {'success': False, 'message': 'Vehicle not found'}
        
        # Send CAN frame with transaction ID
        self.can_service.send_boot_close(vin, txn_id)
        
        # Update vehicle state
        self.update_vehicle_state(vin, {'boot_status': 'closed'})
        
        # Log event with transaction ID
        self.logging_service.log_event('BOOT_CLOSE', f'Vehicle {vin} boot closed', 'info', txn_id)
        
        # Broadcast update
        vehicle.boot_status = 'closed'
        self.broadcast_vehicle_update(vehicle)
        
        return {'success': True, 'message': 'Boot closed', 'vehicle': vehicle.to_dict(), 'transaction_id': txn_id}
    
    def stop_engine(self, vin: str) -> dict:
        """Stop vehicle engine"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        vehicle = self.get_vehicle_by_vin(vin)
        if not vehicle:
            return {'success': False, 'message': 'Vehicle not found'}
        
        # Send CAN frame with transaction ID
        self.can_service.send_engine_stop(vin, txn_id)
        
        # Update vehicle state
        self.update_vehicle_state(vin, {'engine_status': 'off'})
        
        # Log event with transaction ID
        self.logging_service.log_event('ENGINE_STOP', f'Vehicle {vin} engine stopped', 'info', txn_id)
        
        # Broadcast update
        vehicle.engine_status = 'off'
        self.broadcast_vehicle_update(vehicle)
        
        return {'success': True, 'message': 'Engine stopped', 'vehicle': vehicle.to_dict(), 'transaction_id': txn_id}
    
    def locate_vehicle(self, vin: str) -> dict:
        """Locate vehicle (GPS ping)"""
        # Generate transaction ID
        txn_id = self.telemetry_service.generate_transaction_id()
        
        vehicle = self.get_vehicle_by_vin(vin)
        if not vehicle:
            return {'success': False, 'message': 'Vehicle not found'}
        
        # Send CAN frame with transaction ID
        self.can_service.send_gps_locate(vin, txn_id)
        
        # Update vehicle state
        self.update_vehicle_state(vin, {'gps_status': 'tracking'})
        
        # Log event with transaction ID
        self.logging_service.log_event('GPS_LOCATE', f'Vehicle {vin} location requested', 'info', txn_id)
        
        # Broadcast update
        vehicle.gps_status = 'tracking'
        self.broadcast_vehicle_update(vehicle)
        
        # Reset GPS status after 5 seconds
        import threading
        def reset_gps():
            self.update_vehicle_state(vin, {'gps_status': 'active'})
            vehicle.gps_status = 'active'
            self.broadcast_vehicle_update(vehicle)
        
        threading.Timer(5.0, reset_gps).start()
        
        return {'success': True, 'message': 'Vehicle located', 'vehicle': vehicle.to_dict(), 'transaction_id': txn_id}
    
    def close(self):
        """Close service connections"""
        self.can_service.close()
