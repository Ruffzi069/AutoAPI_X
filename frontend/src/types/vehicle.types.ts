/**
 * Type definitions for AutoAPI-X Vehicle Digital Twin
 */

export type DoorStatus = 'locked' | 'unlocked' | 'open' | 'closed';
export type TrunkStatus = 'closed' | 'opening' | 'open';
export type LightStatus = 'off' | 'on' | 'flashing';
export type HornStatus = 'idle' | 'active';
export type EngineStatus = 'off' | 'starting' | 'running';
export type GPSStatus = 'inactive' | 'active' | 'tracking';
export type NetworkStatus = 'disconnected' | 'connected' | 'under_attack';

export interface VehicleState {
  vin: string;
  owner: string;
  battery: number;
  charging: boolean;
  doors_status: string;
  boot_status: string;
  horn_status: string;
  engine_status: string;
  lights_status: string;
  gps_status: string;
  network_status: string;
  firmware_version: string;
  infotainment_status: string;
  activeServices: string[];
  securityEvents: SecurityEvent[];
}

export interface Activity {
  transaction_id?: string;
  timestamp: string;
  action: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface SecurityEvent {
  type: 'idor' | 'broken_auth' | 'replay' | 'data_exposure' | 'ota' | 'rate_limit';
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

export interface APILog {
  transaction_id?: string;
  timestamp: string;
  method: string;
  endpoint: string;
  request: any;
  response: any;
  status: number;
  latency: number;
  type: 'normal' | 'success' | 'attack' | 'warning';
  source?: string;
  user?: string;
}

export interface CANFrame {
  transaction_id?: string;
  timestamp: string;
  can_id: string;
  source_ecu: string;
  destination_ecu: string;
  payload: string;
  message_type: string;
  severity?: string;
}

export interface EventLog {
  transaction_id?: string;
  timestamp: string;
  event_type: string;
  description: string;
  severity: 'info' | 'success' | 'warning' | 'error';
}

export interface VehicleStore extends VehicleState {
  activities: Activity[];
  apiLogs: APILog[];
  canFrames: CANFrame[];
  eventLogs: EventLog[];
  isLoading: boolean;
  updateVehicleState: (updates: Partial<VehicleState>) => void;
  addActivity: (activity: Activity) => void;
  addSecurityEvent: (event: SecurityEvent) => void;
  addAPILog: (log: APILog) => void;
  addCANFrame: (frame: CANFrame) => void;
  addEventLog: (event: EventLog) => void;
  setLoading: (loading: boolean) => void;
}

// Infotainment Types
export interface MediaState {
  platform: 'spotify' | 'youtube';
  is_playing: boolean;
  current_song: string;
  artist: string;
  album: string;
  duration: number;
  position: number;
  volume: number;
  status: string;
}

export interface NavigationState {
  is_navigating: boolean;
  destination: string | null;
  current_location: string;
  eta: string | null;
  distance: number;
  route: string[];
  nearby_chargers: ChargerLocation[];
}

export interface ChargerLocation {
  name: string;
  distance: number;
  available: number;
}

export interface WeatherState {
  temperature: number;
  condition: string;
  humidity: number;
  wind_speed: number;
  location: string;
  icon: string;
}

export interface OTAState {
  current_version: string;
  available_version: string;
  update_available: boolean;
  download_progress: number;
  status: string;
  last_check: string;
  update_size: string;
  release_notes: string[];
}

export interface PhoneState {
  connected: boolean;
  device_name: string;
  battery: number;
  signal_strength: number;
  bluetooth_status: string;
}

export interface CallHistory {
  name: string;
  number: string;
  time: string;
  type: 'incoming' | 'outgoing' | 'missed';
}

export interface Message {
  sender: string;
  preview: string;
  time: string;
  unread: boolean;
}
