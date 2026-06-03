"""
Attack Simulation Service for AutoAPI-X
Generates realistic CAN traffic patterns for various attack scenarios
"""

import time
import threading
from typing import Dict, List, Callable
from services.can_service import CANService
from services.logging_service import LoggingService
from services.telemetry_service import TelemetryService

class AttackSimulationService:
    """Service for simulating automotive cybersecurity attacks with real CAN traffic"""
    
    def __init__(self, socketio=None):
        """Initialize attack simulation service"""
        self.can_service = CANService(socketio)
        self.logging_service = LoggingService(socketio)
        self.telemetry_service = TelemetryService(socketio)
        self.socketio = socketio
        self.active_attacks = {}
    
    def simulate_replay_attack(self, vin: str, iterations: int = 5) -> Dict:
        """
        Replay Attack: Re-send captured vehicle commands
        
        Pattern: Repeated identical CAN frames with timing gaps
        Observable: candump shows repeated unlock frames
        """
        attack_id = self.telemetry_service.generate_transaction_id()
        
        self.logging_service.log_event(
            'ATTACK_STARTED',
            f'Replay Attack initiated - {iterations} iterations',
            'warning',
            attack_id
        )
        
        def execute_attack():
            try:
                for i in range(iterations):
                    # Log attack iteration
                    self.logging_service.log_event(
                        'REPLAY_ATTACK',
                        f'Replaying unlock command (iteration {i+1}/{iterations})',
                        'warning',
                        attack_id
                    )
                    
                    # Send repeated unlock command (captured frame replay)
                    self.can_service.send_door_unlock(vin, attack_id)
                    
                    # Realistic delay between replays (100-300ms)
                    time.sleep(0.2)
                
                # Final summary
                self.logging_service.log_event(
                    'ATTACK_COMPLETED',
                    f'Replay Attack completed - {iterations} frames transmitted',
                    'warning',
                    attack_id
                )
                
            except Exception as e:
                self.logging_service.log_event(
                    'ATTACK_FAILED',
                    f'Replay Attack error: {str(e)}',
                    'error',
                    attack_id
                )
        
        # Execute attack in background thread
        thread = threading.Thread(target=execute_attack, daemon=True)
        thread.start()
        
        return {
            'success': True,
            'attack_id': attack_id,
            'attack_type': 'replay',
            'message': f'Replay attack initiated - {iterations} iterations',
            'expected_can_traffic': f'{iterations} frames on CAN ID 0x321'
        }
    
    def simulate_idor_attack(self, victim_vin: str, attacker_vin: str) -> Dict:
        """
        IDOR Attack: Unauthorized access to another vehicle's resources
        
        Pattern: Unauthorized unlock + GPS access
        Observable: candump shows door unlock and GPS frames
        """
        attack_id = self.telemetry_service.generate_transaction_id()
        
        self.logging_service.log_event(
            'ATTACK_STARTED',
            f'IDOR Attack: Attacker {attacker_vin} targeting {victim_vin}',
            'warning',
            attack_id
        )
        
        def execute_attack():
            try:
                # Stage 1: Unauthorized unlock (100ms delay)
                self.logging_service.log_event(
                    'IDOR_ATTACK',
                    f'Unauthorized door unlock on {victim_vin}',
                    'warning',
                    attack_id
                )
                self.can_service.send_door_unlock(victim_vin, attack_id)
                time.sleep(0.1)
                
                # Stage 2: Unauthorized location access (200ms delay)
                self.logging_service.log_event(
                    'IDOR_ATTACK',
                    f'Unauthorized GPS access on {victim_vin}',
                    'warning',
                    attack_id
                )
                self.can_service.send_gps_locate(victim_vin, attack_id)
                time.sleep(0.2)
                
                # Stage 3: Additional unauthorized access
                self.logging_service.log_event(
                    'IDOR_ATTACK',
                    f'Unauthorized boot access on {victim_vin}',
                    'warning',
                    attack_id
                )
                self.can_service.send_boot_open(victim_vin, attack_id)
                
                self.logging_service.log_event(
                    'ATTACK_COMPLETED',
                    f'IDOR Attack completed - 3 unauthorized commands executed',
                    'warning',
                    attack_id
                )
                
            except Exception as e:
                self.logging_service.log_event(
                    'ATTACK_FAILED',
                    f'IDOR Attack error: {str(e)}',
                    'error',
                    attack_id
                )
        
        thread = threading.Thread(target=execute_attack, daemon=True)
        thread.start()
        
        return {
            'success': True,
            'attack_id': attack_id,
            'attack_type': 'idor',
            'message': 'IDOR attack initiated - unauthorized vehicle access',
            'expected_can_traffic': 'CAN IDs: 0x321 (unlock), 0x500 (GPS), 0x330 (boot)'
        }
    
    def simulate_broken_authentication_attack(self, vin: str) -> Dict:
        """
        Broken Authentication: Execute commands without proper auth
        
        Pattern: Unlock + Horn + Lights without authentication
        Observable: candump shows control frames on multiple ECUs
        """
        attack_id = self.telemetry_service.generate_transaction_id()
        
        self.logging_service.log_event(
            'ATTACK_STARTED',
            f'Broken Authentication Attack on {vin}',
            'warning',
            attack_id
        )
        
        def execute_attack():
            try:
                # Stage 1: Unauthorized door unlock
                self.logging_service.log_event(
                    'BROKEN_AUTH_ATTACK',
                    'Executing door unlock without authentication',
                    'warning',
                    attack_id
                )
                self.can_service.send_door_unlock(vin, attack_id)
                time.sleep(0.15)
                
                # Stage 2: Unauthorized horn activation
                self.logging_service.log_event(
                    'BROKEN_AUTH_ATTACK',
                    'Activating horn without authentication',
                    'warning',
                    attack_id
                )
                self.can_service.send_horn_activate(vin, attack_id)
                time.sleep(0.15)
                
                # Stage 3: Unauthorized lights control
                self.logging_service.log_event(
                    'BROKEN_AUTH_ATTACK',
                    'Flashing lights without authentication',
                    'warning',
                    attack_id
                )
                self.can_service.send_lights_flash(vin, attack_id)
                time.sleep(0.15)
                
                # Stage 4: Unauthorized engine start
                self.logging_service.log_event(
                    'BROKEN_AUTH_ATTACK',
                    'Starting engine without authentication',
                    'warning',
                    attack_id
                )
                self.can_service.send_engine_start(vin, attack_id)
                
                self.logging_service.log_event(
                    'ATTACK_COMPLETED',
                    'Broken Authentication Attack completed - 4 unauthorized commands',
                    'warning',
                    attack_id
                )
                
            except Exception as e:
                self.logging_service.log_event(
                    'ATTACK_FAILED',
                    f'Broken Authentication Attack error: {str(e)}',
                    'error',
                    attack_id
                )
        
        thread = threading.Thread(target=execute_attack, daemon=True)
        thread.start()
        
        return {
            'success': True,
            'attack_id': attack_id,
            'attack_type': 'broken_authentication',
            'message': 'Broken authentication attack initiated',
            'expected_can_traffic': 'CAN IDs: 0x321, 0x320, 0x322, 0x400'
        }
    
    def simulate_excessive_data_exposure_attack(self, vin: str) -> Dict:
        """
        Excessive Data Exposure: Access sensitive vehicle telemetry
        
        Pattern: GPS access + status retrieval (no physical control)
        Observable: candump shows telemetry query frames
        """
        attack_id = self.telemetry_service.generate_transaction_id()
        
        self.logging_service.log_event(
            'ATTACK_STARTED',
            f'Excessive Data Exposure Attack on {vin}',
            'warning',
            attack_id
        )
        
        def execute_attack():
            try:
                # Stage 1: GPS location access
                self.logging_service.log_event(
                    'DATA_EXPOSURE_ATTACK',
                    'Accessing GPS location data',
                    'warning',
                    attack_id
                )
                self.can_service.send_gps_locate(vin, attack_id)
                time.sleep(0.2)
                
                # Stage 2: Vehicle status request (simulated)
                self.logging_service.log_event(
                    'DATA_EXPOSURE_ATTACK',
                    'Accessing vehicle status data',
                    'warning',
                    attack_id
                )
                self.can_service.send_gps_activate(vin, attack_id)
                time.sleep(0.2)
                
                # Stage 3: Telemetry data access
                self.logging_service.log_event(
                    'DATA_EXPOSURE_ATTACK',
                    'Accessing vehicle telemetry',
                    'warning',
                    attack_id
                )
                # Send additional GPS frames to simulate telemetry queries
                for i in range(3):
                    self.can_service.send_gps_locate(vin, attack_id)
                    time.sleep(0.1)
                
                self.logging_service.log_event(
                    'ATTACK_COMPLETED',
                    'Excessive Data Exposure completed - sensitive data accessed',
                    'warning',
                    attack_id
                )
                
            except Exception as e:
                self.logging_service.log_event(
                    'ATTACK_FAILED',
                    f'Data Exposure Attack error: {str(e)}',
                    'error',
                    attack_id
                )
        
        thread = threading.Thread(target=execute_attack, daemon=True)
        thread.start()
        
        return {
            'success': True,
            'attack_id': attack_id,
            'attack_type': 'excessive_data_exposure',
            'message': 'Data exposure attack initiated - accessing telemetry',
            'expected_can_traffic': 'CAN ID 0x500 (GPS) - multiple frames'
        }
    
    def simulate_rate_limiting_failure_attack(self, vin: str, burst_count: int = 30) -> Dict:
        """
        Rate Limiting Failure: Flood vehicle APIs
        
        Pattern: Large burst of mixed CAN messages
        Observable: candump shows high-frequency traffic on multiple ECUs
        """
        attack_id = self.telemetry_service.generate_transaction_id()
        
        self.logging_service.log_event(
            'ATTACK_STARTED',
            f'Rate Limiting Failure Attack - {burst_count} frame burst',
            'warning',
            attack_id
        )
        
        def execute_attack():
            try:
                commands = [
                    ('door_unlock', lambda: self.can_service.send_door_unlock(vin, attack_id)),
                    ('door_lock', lambda: self.can_service.send_door_lock(vin, attack_id)),
                    ('horn', lambda: self.can_service.send_horn_activate(vin, attack_id)),
                    ('lights', lambda: self.can_service.send_lights_flash(vin, attack_id)),
                    ('gps', lambda: self.can_service.send_gps_locate(vin, attack_id)),
                    ('boot_open', lambda: self.can_service.send_boot_open(vin, attack_id)),
                ]
                
                for i in range(burst_count):
                    # Cycle through commands
                    cmd_name, cmd_func = commands[i % len(commands)]
                    
                    self.logging_service.log_event(
                        'RATE_LIMIT_ATTACK',
                        f'Burst frame {i+1}/{burst_count}: {cmd_name}',
                        'warning',
                        attack_id
                    )
                    
                    cmd_func()
                    
                    # Short delay to create visible burst (50-100ms)
                    time.sleep(0.05 if i < burst_count // 2 else 0.1)
                
                self.logging_service.log_event(
                    'ATTACK_COMPLETED',
                    f'Rate Limiting Attack completed - {burst_count} frames transmitted',
                    'warning',
                    attack_id
                )
                
            except Exception as e:
                self.logging_service.log_event(
                    'ATTACK_FAILED',
                    f'Rate Limiting Attack error: {str(e)}',
                    'error',
                    attack_id
                )
        
        thread = threading.Thread(target=execute_attack, daemon=True)
        thread.start()
        
        return {
            'success': True,
            'attack_id': attack_id,
            'attack_type': 'rate_limiting_failure',
            'message': f'Rate limiting attack initiated - {burst_count} frame burst',
            'expected_can_traffic': f'{burst_count} frames across multiple ECUs'
        }
    
    def simulate_ota_manipulation_attack(self, vin: str) -> Dict:
        """
        OTA Manipulation: Simulate malicious firmware activity
        
        Pattern: Staged firmware CAN messages in sequence
        Observable: candump shows OTA command progression
        """
        attack_id = self.telemetry_service.generate_transaction_id()
        
        self.logging_service.log_event(
            'ATTACK_STARTED',
            f'OTA Manipulation Attack on {vin}',
            'warning',
            attack_id
        )
        
        def execute_attack():
            try:
                # Stage 1: OTA Check (fake)
                self.logging_service.log_event(
                    'OTA_MANIPULATION_ATTACK',
                    'Stage 1: Initiating fake OTA check',
                    'warning',
                    attack_id
                )
                self.can_service.send_ota_check(vin, attack_id)
                time.sleep(0.3)
                
                # Stage 2: OTA Download (malicious)
                self.logging_service.log_event(
                    'OTA_MANIPULATION_ATTACK',
                    'Stage 2: Downloading malicious firmware',
                    'warning',
                    attack_id
                )
                self.can_service.send_ota_download(vin, attack_id)
                time.sleep(0.5)
                
                # Stage 3: OTA Install (compromised)
                self.logging_service.log_event(
                    'OTA_MANIPULATION_ATTACK',
                    'Stage 3: Installing compromised firmware',
                    'warning',
                    attack_id
                )
                self.can_service.send_ota_install(vin, attack_id)
                time.sleep(0.3)
                
                # Stage 4: Post-install verification (fake)
                self.logging_service.log_event(
                    'OTA_MANIPULATION_ATTACK',
                    'Stage 4: Firmware verification (bypassed)',
                    'warning',
                    attack_id
                )
                self.can_service.send_ota_check(vin, attack_id)
                time.sleep(0.2)
                
                # Stage 5: Infotainment compromise
                self.logging_service.log_event(
                    'OTA_MANIPULATION_ATTACK',
                    'Stage 5: Infotainment system compromised',
                    'warning',
                    attack_id
                )
                self.can_service.send_infotainment_offline(vin, attack_id)
                
                self.logging_service.log_event(
                    'ATTACK_COMPLETED',
                    'OTA Manipulation completed - firmware compromised',
                    'warning',
                    attack_id
                )
                
            except Exception as e:
                self.logging_service.log_event(
                    'ATTACK_FAILED',
                    f'OTA Manipulation Attack error: {str(e)}',
                    'error',
                    attack_id
                )
        
        thread = threading.Thread(target=execute_attack, daemon=True)
        thread.start()
        
        return {
            'success': True,
            'attack_id': attack_id,
            'attack_type': 'ota_manipulation',
            'message': 'OTA manipulation attack initiated - firmware compromise',
            'expected_can_traffic': 'CAN IDs: 0x700 (OTA), 0x600 (Infotainment)'
        }
    
    def get_attack_status(self, attack_id: str) -> Dict:
        """Get status of ongoing attack"""
        return {
            'attack_id': attack_id,
            'status': 'completed' if attack_id not in self.active_attacks else 'running'
        }
