"""
Vehicle Model for AutoAPI-X
Represents the digital twin state of a connected vehicle
"""

from dataclasses import dataclass
from typing import Optional
from datetime import datetime

@dataclass
class Vehicle:
    """Vehicle model representing connected vehicle state"""
    
    id: int
    vin: str
    owner: str
    battery: int
    doors_status: str  # 'locked' or 'unlocked'
    boot_status: str   # 'open' or 'closed'
    horn_status: str   # 'on' or 'off'
    engine_status: str # 'on' or 'off'
    lights_status: str # 'on' or 'off'
    gps_status: str    # 'active' or 'inactive'
    infotainment_status: str  # 'online' or 'offline'
    firmware_version: str
    network_status: str  # 'connected' or 'disconnected'
    created_at: Optional[str] = None
    
    def to_dict(self):
        """Convert vehicle object to dictionary"""
        return {
            'id': self.id,
            'vin': self.vin,
            'owner': self.owner,
            'battery': self.battery,
            'doors_status': self.doors_status,
            'boot_status': self.boot_status,
            'horn_status': self.horn_status,
            'engine_status': self.engine_status,
            'lights_status': self.lights_status,
            'gps_status': self.gps_status,
            'infotainment_status': self.infotainment_status,
            'firmware_version': self.firmware_version,
            'network_status': self.network_status,
            'created_at': self.created_at
        }
    
    @staticmethod
    def from_db_row(row):
        """Create Vehicle object from database row"""
        return Vehicle(
            id=row['id'],
            vin=row['vin'],
            owner=row['owner'],
            battery=row['battery'],
            doors_status=row['doors_status'],
            boot_status=row['boot_status'],
            horn_status=row['horn_status'],
            engine_status=row['engine_status'],
            lights_status=row['lights_status'],
            gps_status=row['gps_status'],
            infotainment_status=row['infotainment_status'],
            firmware_version=row['firmware_version'],
            network_status=row['network_status'],
            created_at=row['created_at'] if 'created_at' in row.keys() else None
        )
    
    # Vehicle action methods
    def lock(self):
        """Lock vehicle doors"""
        self.doors_status = 'locked'
    
    def unlock(self):
        """Unlock vehicle doors"""
        self.doors_status = 'unlocked'
    
    def open_boot(self):
        """Open vehicle boot"""
        self.boot_status = 'open'
    
    def close_boot(self):
        """Close vehicle boot"""
        self.boot_status = 'closed'
    
    def start_engine(self):
        """Start vehicle engine"""
        self.engine_status = 'running'
    
    def stop_engine(self):
        """Stop vehicle engine"""
        self.engine_status = 'off'
    
    def horn_on(self):
        """Activate horn"""
        self.horn_status = 'on'
    
    def horn_off(self):
        """Deactivate horn"""
        self.horn_status = 'off'
    
    def lights_on(self):
        """Turn on lights"""
        self.lights_status = 'on'
    
    def lights_off(self):
        """Turn off lights"""
        self.lights_status = 'off'
    
    def gps_activate(self):
        """Activate GPS"""
        self.gps_status = 'active'
    
    def gps_deactivate(self):
        """Deactivate GPS"""
        self.gps_status = 'inactive'
    
    def infotainment_online(self):
        """Set infotainment online"""
        self.infotainment_status = 'online'
    
    def infotainment_offline(self):
        """Set infotainment offline"""
        self.infotainment_status = 'offline'
