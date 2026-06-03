/**
 * Attack Execution Store
 * Tracks attack history and generates impact analysis data
 */

import { create } from 'zustand';

export interface AttackExecution {
  id: string;
  attackId: string;
  attackName: string;
  transactionId: string;
  timestamp: string;
  duration: number;
  targetSystems: string[];
  affectedAPIs: string[];
  affectedECUs: string[];
  affectedCANIds: string[];
  affectedComponents: string[];
  apiRequests: number;
  canFrames: number;
  riskDistribution: {
    privacy: number;
    operational: number;
    safety: number;
    technical: number;
  };
  timeline: Array<{
    time: string;
    event: string;
  }>;
  telemetry: {
    apiActivity: Array<{ time: number; count: number }>;
    canActivity: Array<{ time: number; count: number }>;
    ecuActivity: Record<string, number>;
  };
  attackPath: Array<{
    step: number;
    component: string;
    type: 'attacker' | 'api' | 'ecu' | 'vehicle';
  }>;
  vehicleHeatMap: string[]; // Affected vehicle areas
}

// Attack-specific impact data
const attackImpactProfiles: Record<string, Omit<AttackExecution, 'id' | 'transactionId' | 'timestamp' | 'duration' | 'timeline'>> = {
  'replay': {
    attackId: 'replay',
    attackName: 'Replay Attack',
    targetSystems: ['Command Processing', 'Vehicle Access', 'CAN Bus'],
    affectedAPIs: [
      '/api/vehicles/{vin}/unlock',
      '/api/vehicles/{vin}/engine/start'
    ],
    affectedECUs: ['Door Control ECU', 'Engine Control ECU', 'Gateway ECU'],
    affectedCANIds: ['0x321', '0x2C1', '0x244'],
    affectedComponents: ['Door System', 'Command Processing', 'ECU Network'],
    apiRequests: 5,
    canFrames: 5,
    riskDistribution: {
      privacy: 50,
      operational: 80,
      safety: 60,
      technical: 70
    },
    telemetry: {
      apiActivity: [
        { time: 0, count: 0 },
        { time: 0.5, count: 1 },
        { time: 0.8, count: 2 },
        { time: 1.1, count: 3 },
        { time: 1.4, count: 4 },
        { time: 1.7, count: 5 },
        { time: 2.0, count: 5 }
      ],
      canActivity: [
        { time: 0, count: 0 },
        { time: 0.6, count: 1 },
        { time: 0.9, count: 2 },
        { time: 1.2, count: 3 },
        { time: 1.5, count: 4 },
        { time: 1.8, count: 5 },
        { time: 2.0, count: 5 }
      ],
      ecuActivity: {
        'Door Control ECU': 5,
        'Engine Control ECU': 1,
        'Gateway ECU': 5
      }
    },
    attackPath: [
      { step: 1, component: 'Attacker', type: 'attacker' },
      { step: 2, component: 'Captured Command', type: 'api' },
      { step: 3, component: 'Gateway ECU', type: 'ecu' },
      { step: 4, component: 'Door Control ECU (x5)', type: 'ecu' },
      { step: 5, component: 'Vehicle', type: 'vehicle' }
    ],
    vehicleHeatMap: ['door', 'network']
  },
  'idor': {
    attackId: 'idor',
    attackName: 'IDOR',
    targetSystems: ['Vehicle Access', 'Location Services', 'Vehicle State'],
    affectedAPIs: [
      '/api/vehicles/{vin}/unlock',
      '/api/vehicles/{vin}/location',
      '/api/vehicles/{vin}/status'
    ],
    affectedECUs: ['Door Control ECU', 'GPS ECU', 'Gateway ECU'],
    affectedCANIds: ['0x321', '0x327', '0x2C1'],
    affectedComponents: ['Door System', 'GPS Module', 'Security Gateway'],
    apiRequests: 3,
    canFrames: 3,
    riskDistribution: {
      privacy: 90,
      operational: 70,
      safety: 40,
      technical: 60
    },
    telemetry: {
      apiActivity: [
        { time: 0, count: 0 },
        { time: 0.5, count: 1 },
        { time: 1.0, count: 2 },
        { time: 1.5, count: 3 },
        { time: 2.0, count: 3 }
      ],
      canActivity: [
        { time: 0, count: 0 },
        { time: 0.6, count: 1 },
        { time: 1.2, count: 2 },
        { time: 1.8, count: 3 },
        { time: 2.0, count: 3 }
      ],
      ecuActivity: {
        'Door Control ECU': 2,
        'GPS ECU': 2,
        'Gateway ECU': 3
      }
    },
    attackPath: [
      { step: 1, component: 'Attacker', type: 'attacker' },
      { step: 2, component: 'Vehicle Access API', type: 'api' },
      { step: 3, component: 'Gateway ECU', type: 'ecu' },
      { step: 4, component: 'Door Control ECU', type: 'ecu' },
      { step: 5, component: 'Vehicle', type: 'vehicle' }
    ],
    vehicleHeatMap: ['door', 'gps', 'network']
  },
  'broken-authentication': {
    attackId: 'broken-authentication',
    attackName: 'Broken Authentication',
    targetSystems: ['Authentication', 'API Gateway', 'Vehicle Control'],
    affectedAPIs: [
      '/api/vehicles/{vin}/horn',
      '/api/vehicles/{vin}/lights',
      '/api/media/play'
    ],
    affectedECUs: ['Gateway ECU', 'Infotainment ECU', 'Body Control ECU'],
    affectedCANIds: ['0x2C1', '0x400', '0x320'],
    affectedComponents: ['API Gateway', 'Body Control', 'Infotainment System'],
    apiRequests: 3,
    canFrames: 3,
    riskDistribution: {
      privacy: 60,
      operational: 85,
      safety: 50,
      technical: 90
    },
    telemetry: {
      apiActivity: [
        { time: 0, count: 0 },
        { time: 0.5, count: 1 },
        { time: 1.0, count: 2 },
        { time: 1.5, count: 3 },
        { time: 2.0, count: 3 }
      ],
      canActivity: [
        { time: 0, count: 0 },
        { time: 0.6, count: 1 },
        { time: 1.2, count: 2 },
        { time: 1.8, count: 3 },
        { time: 2.0, count: 3 }
      ],
      ecuActivity: {
        'Gateway ECU': 3,
        'Infotainment ECU': 2,
        'Body Control ECU': 2
      }
    },
    attackPath: [
      { step: 1, component: 'Attacker', type: 'attacker' },
      { step: 2, component: 'API Gateway (No Auth)', type: 'api' },
      { step: 3, component: 'Gateway ECU', type: 'ecu' },
      { step: 4, component: 'Body Control ECU', type: 'ecu' },
      { step: 5, component: 'Vehicle', type: 'vehicle' }
    ],
    vehicleHeatMap: ['horn', 'lights', 'network']
  },
  'excessive-data-exposure': {
    attackId: 'excessive-data-exposure',
    attackName: 'Excessive Data Exposure',
    targetSystems: ['Data Privacy', 'Location Services', 'Telemetry'],
    affectedAPIs: [
      '/api/vehicles/{vin}/status',
      '/api/vehicles/{vin}/telemetry',
      '/api/infotainment/navigation/location'
    ],
    affectedECUs: ['GPS ECU', 'Telemetry ECU', 'Gateway ECU'],
    affectedCANIds: ['0x327', '0x3B2', '0x2C1'],
    affectedComponents: ['GPS Module', 'Telemetry System', 'Data Gateway'],
    apiRequests: 3,
    canFrames: 3,
    riskDistribution: {
      privacy: 95,
      operational: 40,
      safety: 30,
      technical: 55
    },
    telemetry: {
      apiActivity: [
        { time: 0, count: 0 },
        { time: 0.5, count: 1 },
        { time: 1.0, count: 2 },
        { time: 1.5, count: 3 },
        { time: 2.0, count: 3 }
      ],
      canActivity: [
        { time: 0, count: 0 },
        { time: 0.6, count: 1 },
        { time: 1.2, count: 2 },
        { time: 1.8, count: 3 },
        { time: 2.0, count: 3 }
      ],
      ecuActivity: {
        'GPS ECU': 3,
        'Telemetry ECU': 2,
        'Gateway ECU': 2
      }
    },
    attackPath: [
      { step: 1, component: 'Attacker', type: 'attacker' },
      { step: 2, component: 'Status API', type: 'api' },
      { step: 3, component: 'Gateway ECU', type: 'ecu' },
      { step: 4, component: 'GPS ECU', type: 'ecu' },
      { step: 5, component: 'Data Leak', type: 'vehicle' }
    ],
    vehicleHeatMap: ['gps', 'network']
  },
  'rate-limiting-failure': {
    attackId: 'rate-limiting-failure',
    attackName: 'Rate Limiting Failure',
    targetSystems: ['API Gateway', 'Service Availability', 'Resource Management'],
    affectedAPIs: [
      '/api/vehicles/{vin}/horn',
      '/api/vehicles/{vin}/lights',
      '/api/media/play'
    ],
    affectedECUs: ['Gateway ECU', 'Body Control ECU', 'All Connected ECUs'],
    affectedCANIds: ['0x320', '0x321', '0x400'],
    affectedComponents: ['API Gateway', 'Service Layer', 'Resource Manager'],
    apiRequests: 6,
    canFrames: 6,
    riskDistribution: {
      privacy: 30,
      operational: 90,
      safety: 55,
      technical: 75
    },
    telemetry: {
      apiActivity: [
        { time: 0, count: 0 },
        { time: 0.2, count: 1 },
        { time: 0.3, count: 2 },
        { time: 0.4, count: 3 },
        { time: 0.5, count: 4 },
        { time: 0.6, count: 5 },
        { time: 0.7, count: 6 },
        { time: 2.0, count: 6 }
      ],
      canActivity: [
        { time: 0, count: 0 },
        { time: 0.3, count: 1 },
        { time: 0.4, count: 2 },
        { time: 0.5, count: 3 },
        { time: 0.6, count: 4 },
        { time: 0.7, count: 5 },
        { time: 0.8, count: 6 },
        { time: 2.0, count: 6 }
      ],
      ecuActivity: {
        'Gateway ECU': 6,
        'Body Control ECU': 6,
        'All Connected ECUs': 3
      }
    },
    attackPath: [
      { step: 1, component: 'Attacker', type: 'attacker' },
      { step: 2, component: 'API Flood (x6)', type: 'api' },
      { step: 3, component: 'Gateway ECU', type: 'ecu' },
      { step: 4, component: 'System Overload', type: 'ecu' },
      { step: 5, component: 'Service Degradation', type: 'vehicle' }
    ],
    vehicleHeatMap: ['network', 'horn']
  },
  'ota-manipulation': {
    attackId: 'ota-manipulation',
    attackName: 'OTA Manipulation',
    targetSystems: ['Firmware Management', 'OTA Service', 'System Integrity'],
    affectedAPIs: [
      '/api/infotainment/ota/check',
      '/api/infotainment/ota/download',
      '/api/infotainment/ota/install'
    ],
    affectedECUs: ['Infotainment ECU', 'Gateway ECU', 'Telematics Unit'],
    affectedCANIds: ['0x400', '0x2C1', '0x7E0'],
    affectedComponents: ['Infotainment System', 'Firmware Service', 'OTA Gateway'],
    apiRequests: 3,
    canFrames: 3,
    riskDistribution: {
      privacy: 70,
      operational: 95,
      safety: 85,
      technical: 100
    },
    telemetry: {
      apiActivity: [
        { time: 0, count: 0 },
        { time: 0.5, count: 1 },
        { time: 1.5, count: 2 },
        { time: 2.5, count: 3 },
        { time: 4.0, count: 3 }
      ],
      canActivity: [
        { time: 0, count: 0 },
        { time: 0.6, count: 1 },
        { time: 2.0, count: 2 },
        { time: 3.0, count: 3 },
        { time: 4.0, count: 3 }
      ],
      ecuActivity: {
        'Infotainment ECU': 3,
        'Gateway ECU': 2,
        'Telematics Unit': 2
      }
    },
    attackPath: [
      { step: 1, component: 'Attacker', type: 'attacker' },
      { step: 2, component: 'OTA Service', type: 'api' },
      { step: 3, component: 'Gateway ECU', type: 'ecu' },
      { step: 4, component: 'Infotainment ECU', type: 'ecu' },
      { step: 5, component: 'Malicious Firmware', type: 'vehicle' }
    ],
    vehicleHeatMap: ['firmware', 'network']
  }
};

interface AttackStore {
  executions: AttackExecution[];
  currentExecution: AttackExecution | null;
  addExecution: (attackId: string, transactionId: string, timeline: Array<{time: string, event: string}>) => void;
  setCurrentExecution: (execution: AttackExecution | null) => void;
  getExecutionById: (id: string) => AttackExecution | undefined;
  getExecutionsByAttackId: (attackId: string) => AttackExecution[];
}

export const useAttackStore = create<AttackStore>((set, get) => ({
  executions: [],
  currentExecution: null,

  addExecution: (attackId: string, transactionId: string, timeline: Array<{time: string, event: string}>) => {
    const profile = attackImpactProfiles[attackId];
    if (!profile) return;

    const execution: AttackExecution = {
      id: `exec-${Date.now()}`,
      ...profile,
      transactionId,
      timestamp: new Date().toISOString(),
      duration: timeline.length > 0 ? 4 : 0, // Approximate duration in seconds
      timeline
    };

    set(state => ({
      executions: [...state.executions, execution],
      currentExecution: execution
    }));
  },

  setCurrentExecution: (execution: AttackExecution | null) => {
    set({ currentExecution: execution });
  },

  getExecutionById: (id: string) => {
    return get().executions.find(exec => exec.id === id);
  },

  getExecutionsByAttackId: (attackId: string) => {
    return get().executions.filter(exec => exec.attackId === attackId);
  }
}));
