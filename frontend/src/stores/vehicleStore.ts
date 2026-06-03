/**
 * Zustand store for vehicle state management
 */

import { create } from 'zustand';
import type { VehicleStore, Activity, SecurityEvent, APILog, CANFrame, EventLog } from '../types/vehicle.types';

export const useVehicleStore = create<VehicleStore>((set) => ({
  // Initial vehicle state
  vin: '5YJ3E1EA1KF000001',
  owner: 'User A',
  battery: 84,
  charging: false,
  doors_status: 'locked',
  boot_status: 'closed',
  horn_status: 'off',
  engine_status: 'off',
  lights_status: 'off',
  gps_status: 'active',
  network_status: 'connected',
  firmware_version: 'v1.2.3',
  infotainment_status: 'idle',
  activeServices: [],
  securityEvents: [],
  activities: [],
  apiLogs: [],
  canFrames: [],
  eventLogs: [],
  isLoading: false,
  
  // Actions
  updateVehicleState: (updates) => 
    set((state) => ({ ...state, ...updates })),
  
  addActivity: (activity: Activity) =>
    set((state) => ({
      activities: [activity, ...state.activities].slice(0, 50)
    })),
  
  addSecurityEvent: (event: SecurityEvent) =>
    set((state) => ({
      securityEvents: [...state.securityEvents, event]
    })),
  
  addAPILog: (log: APILog) =>
    set((state) => ({
      apiLogs: [log, ...state.apiLogs].slice(0, 100)
    })),
  
  addCANFrame: (frame: CANFrame) =>
    set((state) => ({
      canFrames: [frame, ...state.canFrames].slice(0, 100)
    })),
  
  addEventLog: (event: EventLog) =>
    set((state) => ({
      eventLogs: [event, ...state.eventLogs].slice(0, 100)
    })),
  
  setLoading: (loading: boolean) =>
    set({ isLoading: loading })
}));
