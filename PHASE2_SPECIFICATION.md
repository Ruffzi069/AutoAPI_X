# AutoAPI-X Phase 2 - Development Specification

**Phase Name:** Dashboard + Google Pixel Controller + Vehicle Digital Twin Integration  
**Version:** 1.0  
**Date:** June 2, 2026  
**Status:** Ready for Development

---

## Executive Summary

Phase 2 transforms the AutoAPI-X backend foundation into a fully interactive connected vehicle simulation platform. Users will control a vehicle through a Google Pixel-inspired mobile interface and observe real-time state changes through the Vehicle Digital Twin.

**Key Deliverable:** A professional, production-grade connected vehicle dashboard that demonstrates how modern vehicle ecosystems work.

---

## Objectives

### Primary Objective
Build the first fully interactive AutoAPI-X experience where every user action flows through the complete system:

```
Google Pixel Controller
    ↓
API Request
    ↓
Flask Backend
    ↓
Vehicle Service
    ↓
CAN Frame Generation
    ↓
Vehicle State Update
    ↓
SocketIO Event
    ↓
Vehicle Digital Twin Update
    ↓
Log Creation
```

### Secondary Objectives
1. Demonstrate real connected vehicle architecture
2. Establish real-time synchronization patterns
3. Create professional OEM-grade UI
4. Validate Phase 1 backend infrastructure
5. Prepare foundation for attack simulations (Phase 4)

---

## Dashboard Architecture

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                     AutoAPI-X Dashboard                          │
├──────────────┬──────────────────────────────────┬───────────────┤
│              │                                  │               │
│   Google     │    Vehicle Digital Twin          │   Vehicle     │
│   Pixel      │                                  │   Info Panel  │
│   Controller │    [VEHICLE VISUALIZATION]       │               │
│              │                                  │   • VIN       │
│   📱 Phone   │         [VEHICLE IMAGE]          │   • Owner     │
│   Frame      │                                  │   • Battery   │
│              │    Status: Connected             │   • Network   │
│   Controls:  │    Battery: 84%                  │   • GPS       │
│   • Lock     │    Doors: Locked                 │   • Status    │
│   • Unlock   │    Engine: Off                   │               │
│   • Horn     │                                  │   Logs:       │
│   • Lights   │                                  │   • Last API  │
│   • Boot     │                                  │   • Last CAN  │
│   • Engine   │                                  │   • Events    │
│   • GPS      │                                  │               │
│              │                                  │               │
│   (25%)      │           (50%)                  │    (25%)      │
└──────────────┴──────────────────────────────────┴───────────────┘
```

### Responsive Behavior

**Desktop (>1280px):**
- 3-column layout (25% | 50% | 25%)
- All components visible
- Full detail display

**Tablet (768px - 1280px):**
- 2-column layout
- Vehicle Twin + Info Panel
- Controller collapses to bottom drawer

**Mobile (<768px):**
- Single column, stacked
- Vehicle Twin at top
- Swipeable panels

---

## Component Specifications

### 1. Google Pixel Controller

#### Visual Design

**Appearance:**
- Realistic Google Pixel phone frame
- Modern smartphone proportions (9:19.5 aspect ratio)
- Rounded corners, thin bezels
- Dark theme with purple accents
- Professional vehicle app interface

**Inspiration:**
- Tesla Mobile App
- BMW Connected Drive
- Mercedes Me
- Hyundai Bluelink
- Rivian App

**NOT:**
- Generic card with buttons
- Hacker-themed UI
- Developer dashboard
- Gaming interface

#### Phone Frame Design

```typescript
// Pixel phone dimensions
const phoneFrame = {
  width: '360px',
  height: '780px',
  borderRadius: '32px',
  border: '12px solid #1A1A2E',
  background: '#0F0F14',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
};
```

#### App Interface Layout

```
┌─────────────────────────┐
│  ⚫ ⚫ ⚫  [12:34]  📶 🔋 │  ← Status bar
├─────────────────────────┤
│                         │
│   Tesla Model 3         │  ← Vehicle header
│   VIN: 5YJ3...          │
│                         │
├─────────────────────────┤
│                         │
│   🔓 Vehicle Access     │  ← Section 1
│   ┌─────────┬─────────┐ │
│   │  Lock   │ Unlock  │ │
│   └─────────┴─────────┘ │
│                         │
│   🚗 Vehicle Functions  │  ← Section 2
│   ┌─────────┬─────────┐ │
│   │  Horn   │ Lights  │ │
│   ├─────────┼─────────┤ │
│   │  Boot   │ Climate │ │
│   └─────────┴─────────┘ │
│                         │
│   ⚡ Vehicle Power      │  ← Section 3
│   ┌─────────┬─────────┐ │
│   │  Start  │  Stop   │ │
│   └─────────┴─────────┘ │
│                         │
│   📍 Location           │  ← Section 4
│   ┌─────────────────┐   │
│   │  Locate Vehicle │   │
│   └─────────────────┘   │
│                         │
└─────────────────────────┘
```


#### Control Buttons

**Button Design:**
```typescript
const buttonStyle = {
  background: 'linear-gradient(135deg, #6D28D9 0%, #A855F7 100%)',
  borderRadius: '12px',
  padding: '16px',
  color: '#FFFFFF',
  fontSize: '14px',
  fontWeight: '600',
  boxShadow: '0 4px 12px rgba(109, 40, 217, 0.3)',
  transition: 'all 0.3s ease',
  
  // Hover state
  hover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(109, 40, 217, 0.4)'
  },
  
  // Active state
  active: {
    transform: 'translateY(0)',
    boxShadow: '0 2px 8px rgba(109, 40, 217, 0.3)'
  }
};
```

**Button States:**
- **Idle:** Default gradient
- **Loading:** Spinner animation
- **Success:** Green checkmark (1s)
- **Error:** Red shake animation

#### Available Controls

**1. Vehicle Access**
- Lock Vehicle
- Unlock Vehicle

**2. Vehicle Functions**
- Horn (momentary)
- Flash Lights (3x flash)
- Open Boot
- Close Boot

**3. Vehicle Power**
- Start Engine
- Stop Engine

**4. Vehicle Location**
- Locate Vehicle (GPS ping)

**5. Vehicle Comfort** (Future)
- Climate Control

**6. Vehicle Maintenance** (Future)
- OTA Update Check

#### Interaction Flow

```typescript
// Example: Unlock button click
const handleUnlock = async () => {
  // 1. Show loading state
  setButtonState('loading');
  
  // 2. Send API request
  const response = await fetch(`/api/vehicles/${vin}/unlock`, {
    method: 'POST'
  });
  
  // 3. Handle response
  if (response.ok) {
    setButtonState('success');
    // Success feedback shown for 1s
    setTimeout(() => setButtonState('idle'), 1000);
  } else {
    setButtonState('error');
    setTimeout(() => setButtonState('idle'), 1000);
  }
};
```

---

### 2. Vehicle Digital Twin

**Implementation:** Use the complete design from `VEHICLE_DIGITAL_TWIN_DESIGN.md`

#### Key Features

**Visual Reactions:**
- Door unlock: Green glow, door highlight
- Door lock: Purple glow, lock icon
- Horn: Pulse animation, sound waves
- Lights: Flashing headlights/taillights
- Boot: Opening animation
- Engine: Running indicator, vehicle glow
- GPS: Beacon pulse effect

**Real-time Updates:**
```typescript
// Socket.IO listener
socket.on('vehicle_updates', (data) => {
  updateVehicleState(data);
  animateChangedComponents(data);
});
```

**Performance:**
- 60fps animations
- < 50ms update latency
- Smooth transitions
- No jank or stutter

---

### 3. Vehicle Information Panel

#### Layout

```
┌─────────────────────────┐
│ Vehicle Information     │
├─────────────────────────┤
│                         │
│ 🚗 Tesla Model 3        │
│ VIN: 5YJ3E1EA1KF000001  │
│ Owner: User A           │
│                         │
├─────────────────────────┤
│ Status                  │
├─────────────────────────┤
│ 🔋 Battery: 84%         │
│ 📡 Network: Connected   │
│ 📍 GPS: Active          │
│ 🔧 Firmware: v1.2.3     │
│                         │
├─────────────────────────┤
│ Vehicle State           │
├─────────────────────────┤
│ 🚪 Doors: Locked        │
│ 🎒 Boot: Closed         │
│ 🔥 Engine: Off          │
│ 💡 Lights: Off          │
│                         │
├─────────────────────────┤
│ Recent Activity         │
├─────────────────────────┤
│ 12:34:56 - Unlocked     │
│ 12:34:45 - Horn         │
│ 12:34:30 - Locked       │
│                         │
└─────────────────────────┘
```

#### Real-time Updates

**Update Mechanism:**
```typescript
socket.on('vehicle_updates', (data) => {
  // Update all fields
  setBattery(data.battery);
  setDoorStatus(data.doors_status);
  setEngineStatus(data.engine_status);
  // ... etc
  
  // Add to activity log
  addActivity({
    timestamp: new Date(),
    action: data.lastAction
  });
});
```

**Activity Log:**
- Last 10 actions
- Timestamp
- Action description
- Color-coded by type

---

## Technology Stack

### Frontend

**Core:**
- React 18+
- TypeScript
- Vite (build tool)

**Styling:**
- Tailwind CSS
- CSS Modules (for phone frame)

**Animation:**
- Framer Motion

**State Management:**
- Zustand

**Real-time:**
- Socket.IO Client

**HTTP:**
- Fetch API / Axios

**Icons:**
- Lucide React

### Project Structure

```
frontend/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Dashboard.module.css
│   │   ├── GooglePixelController/
│   │   │   ├── GooglePixelController.tsx
│   │   │   ├── PhoneFrame.tsx
│   │   │   ├── ControlButton.tsx
│   │   │   └── GooglePixelController.module.css
│   │   ├── VehicleDigitalTwin/
│   │   │   ├── VehicleDigitalTwin.tsx
│   │   │   ├── VehicleSVG.tsx
│   │   │   ├── VehicleEffects.tsx
│   │   │   ├── VehicleStatusOverlay.tsx
│   │   │   └── components/
│   │   │       ├── DoorComponent.tsx
│   │   │       ├── TrunkComponent.tsx
│   │   │       ├── HeadlightComponent.tsx
│   │   │       └── ...
│   │   └── VehicleInfoPanel/
│   │       ├── VehicleInfoPanel.tsx
│   │       ├── StatusSection.tsx
│   │       ├── ActivityLog.tsx
│   │       └── VehicleInfoPanel.module.css
│   ├── stores/
│   │   └── vehicleStore.ts
│   ├── hooks/
│   │   ├── useVehicleState.ts
│   │   ├── useSocketIO.ts
│   │   └── useVehicleAPI.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── socket.ts
│   ├── types/
│   │   └── vehicle.types.ts
│   ├── utils/
│   │   └── formatters.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## API Integration

### API Service

```typescript
// services/api.ts
const API_BASE = 'http://localhost:5000/api';

export const vehicleAPI = {
  // Get vehicle
  getVehicle: async (vin: string) => {
    const response = await fetch(`${API_BASE}/vehicles/${vin}`);
    return response.json();
  },
  
  // Lock/Unlock
  lock: async (vin: string) => {
    const response = await fetch(`${API_BASE}/vehicles/${vin}/lock`, {
      method: 'POST'
    });
    return response.json();
  },
  
  unlock: async (vin: string) => {
    const response = await fetch(`${API_BASE}/vehicles/${vin}/unlock`, {
      method: 'POST'
    });
    return response.json();
  },
  
  // Horn
  horn: async (vin: string) => {
    const response = await fetch(`${API_BASE}/vehicles/${vin}/horn`, {
      method: 'POST'
    });
    return response.json();
  },
  
  // Boot
  openBoot: async (vin: string) => {
    const response = await fetch(`${API_BASE}/vehicles/${vin}/boot/open`, {
      method: 'POST'
    });
    return response.json();
  },
  
  // Engine
  startEngine: async (vin: string) => {
    const response = await fetch(`${API_BASE}/vehicles/${vin}/engine/start`, {
      method: 'POST'
    });
    return response.json();
  },
  
  stopEngine: async (vin: string) => {
    const response = await fetch(`${API_BASE}/vehicles/${vin}/engine/stop`, {
      method: 'POST'
    });
    return response.json();
  }
};
```


### Socket.IO Integration

```typescript
// services/socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
    
    socket.on('connect', () => {
      console.log('✓ Connected to AutoAPI-X backend');
    });
    
    socket.on('disconnect', () => {
      console.log('✗ Disconnected from backend');
    });
  }
  
  return socket;
};

export const getSocket = () => socket;
```

```typescript
// hooks/useSocketIO.ts
import { useEffect } from 'react';
import { initializeSocket } from '@/services/socket';
import { useVehicleStore } from '@/stores/vehicleStore';

export const useSocketIO = () => {
  const updateVehicleState = useVehicleStore(s => s.updateVehicleState);
  const addActivity = useVehicleStore(s => s.addActivity);
  
  useEffect(() => {
    const socket = initializeSocket();
    
    // Vehicle state updates
    socket.on('vehicle_updates', (data) => {
      updateVehicleState(data);
      addActivity({
        timestamp: new Date().toISOString(),
        action: data.lastAction || 'State updated',
        type: 'info'
      });
    });
    
    // CAN frame updates
    socket.on('can_updates', (data) => {
      console.log('CAN Frame:', data);
    });
    
    // API updates
    socket.on('api_updates', (data) => {
      console.log('API Call:', data);
    });
    
    // Event updates
    socket.on('event_updates', (data) => {
      console.log('Event:', data);
    });
    
    return () => {
      socket.off('vehicle_updates');
      socket.off('can_updates');
      socket.off('api_updates');
      socket.off('event_updates');
    };
  }, []);
};
```

---

## State Management

### Zustand Store

```typescript
// stores/vehicleStore.ts
import create from 'zustand';

interface Activity {
  timestamp: string;
  action: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface VehicleState {
  // Vehicle data
  vin: string;
  owner: string;
  battery: number;
  doors_status: string;
  boot_status: string;
  horn_status: string;
  engine_status: string;
  lights_status: string;
  gps_status: string;
  network_status: string;
  firmware_version: string;
  
  // Activity log
  activities: Activity[];
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  updateVehicleState: (updates: Partial<VehicleState>) => void;
  addActivity: (activity: Activity) => void;
  setLoading: (loading: boolean) => void;
}

export const useVehicleStore = create<VehicleState>((set) => ({
  // Initial state
  vin: '5YJ3E1EA1KF000001',
  owner: 'User A',
  battery: 84,
  doors_status: 'locked',
  boot_status: 'closed',
  horn_status: 'off',
  engine_status: 'off',
  lights_status: 'off',
  gps_status: 'active',
  network_status: 'connected',
  firmware_version: 'v1.2.3',
  activities: [],
  isLoading: false,
  
  // Actions
  updateVehicleState: (updates) => 
    set((state) => ({ ...state, ...updates })),
  
  addActivity: (activity) =>
    set((state) => ({
      activities: [activity, ...state.activities].slice(0, 10)
    })),
  
  setLoading: (loading) =>
    set({ isLoading: loading })
}));
```

---

## Component Implementation

### Dashboard Component

```typescript
// components/Dashboard/Dashboard.tsx
import { useEffect } from 'react';
import { GooglePixelController } from '@/components/GooglePixelController';
import { VehicleDigitalTwin } from '@/components/VehicleDigitalTwin';
import { VehicleInfoPanel } from '@/components/VehicleInfoPanel';
import { useSocketIO } from '@/hooks/useSocketIO';
import './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  // Initialize Socket.IO connection
  useSocketIO();
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>AutoAPI-X</h1>
        <p>Connected Vehicle Security Platform</p>
      </header>
      
      <div className="dashboard-grid">
        {/* Left: Google Pixel Controller */}
        <div className="controller-panel">
          <GooglePixelController />
        </div>
        
        {/* Center: Vehicle Digital Twin */}
        <div className="vehicle-panel">
          <VehicleDigitalTwin />
        </div>
        
        {/* Right: Vehicle Info Panel */}
        <div className="info-panel">
          <VehicleInfoPanel />
        </div>
      </div>
    </div>
  );
};
```

### Google Pixel Controller Component

```typescript
// components/GooglePixelController/GooglePixelController.tsx
import { useState } from 'react';
import { PhoneFrame } from './PhoneFrame';
import { ControlButton } from './ControlButton';
import { useVehicleStore } from '@/stores/vehicleStore';
import { vehicleAPI } from '@/services/api';
import { Lock, Unlock, Volume2, Lightbulb, Package, Power } from 'lucide-react';

export const GooglePixelController: React.FC = () => {
  const vin = useVehicleStore(s => s.vin);
  const [loadingButton, setLoadingButton] = useState<string | null>(null);
  
  const handleAction = async (action: string, apiCall: () => Promise<any>) => {
    setLoadingButton(action);
    try {
      await apiCall();
      // Success handled by Socket.IO update
    } catch (error) {
      console.error(`Error: ${action}`, error);
    } finally {
      setTimeout(() => setLoadingButton(null), 1000);
    }
  };
  
  return (
    <PhoneFrame>
      <div className="phone-app">
        {/* Header */}
        <div className="app-header">
          <h2>Tesla Model 3</h2>
          <p className="text-sm text-gray-400">VIN: {vin}</p>
        </div>
        
        {/* Vehicle Access */}
        <section className="control-section">
          <h3>🔓 Vehicle Access</h3>
          <div className="button-grid">
            <ControlButton
              icon={<Lock />}
              label="Lock"
              onClick={() => handleAction('lock', () => vehicleAPI.lock(vin))}
              loading={loadingButton === 'lock'}
            />
            <ControlButton
              icon={<Unlock />}
              label="Unlock"
              onClick={() => handleAction('unlock', () => vehicleAPI.unlock(vin))}
              loading={loadingButton === 'unlock'}
            />
          </div>
        </section>
        
        {/* Vehicle Functions */}
        <section className="control-section">
          <h3>🚗 Vehicle Functions</h3>
          <div className="button-grid">
            <ControlButton
              icon={<Volume2 />}
              label="Horn"
              onClick={() => handleAction('horn', () => vehicleAPI.horn(vin))}
              loading={loadingButton === 'horn'}
            />
            <ControlButton
              icon={<Lightbulb />}
              label="Lights"
              onClick={() => handleAction('lights', () => vehicleAPI.flashLights(vin))}
              loading={loadingButton === 'lights'}
            />
            <ControlButton
              icon={<Package />}
              label="Open Boot"
              onClick={() => handleAction('boot', () => vehicleAPI.openBoot(vin))}
              loading={loadingButton === 'boot'}
            />
          </div>
        </section>
        
        {/* Vehicle Power */}
        <section className="control-section">
          <h3>⚡ Vehicle Power</h3>
          <div className="button-grid">
            <ControlButton
              icon={<Power />}
              label="Start Engine"
              onClick={() => handleAction('start', () => vehicleAPI.startEngine(vin))}
              loading={loadingButton === 'start'}
            />
            <ControlButton
              icon={<Power />}
              label="Stop Engine"
              onClick={() => handleAction('stop', () => vehicleAPI.stopEngine(vin))}
              loading={loadingButton === 'stop'}
            />
          </div>
        </section>
      </div>
    </PhoneFrame>
  );
};
```

### Control Button Component

```typescript
// components/GooglePixelController/ControlButton.tsx
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  icon,
  label,
  onClick,
  loading = false,
  disabled = false
}) => {
  return (
    <motion.button
      className="control-button"
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="button-icon">
        {loading ? <Loader2 className="animate-spin" /> : icon}
      </div>
      <span className="button-label">{label}</span>
    </motion.button>
  );
};
```


### Phone Frame Component

```typescript
// components/GooglePixelController/PhoneFrame.tsx
import { motion } from 'framer-motion';
import './PhoneFrame.module.css';

export const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      className="phone-frame"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Status Bar */}
      <div className="phone-status-bar">
        <div className="status-left">
          <span className="time">12:34</span>
        </div>
        <div className="status-notch" />
        <div className="status-right">
          <span className="signal">📶</span>
          <span className="battery">🔋</span>
        </div>
      </div>
      
      {/* App Content */}
      <div className="phone-content">
        {children}
      </div>
      
      {/* Navigation Bar */}
      <div className="phone-nav-bar">
        <div className="nav-indicator" />
      </div>
    </motion.div>
  );
};
```

### Vehicle Info Panel Component

```typescript
// components/VehicleInfoPanel/VehicleInfoPanel.tsx
import { useVehicleStore } from '@/stores/vehicleStore';
import { StatusSection } from './StatusSection';
import { ActivityLog } from './ActivityLog';
import { Battery, Wifi, MapPin, Cpu } from 'lucide-react';

export const VehicleInfoPanel: React.FC = () => {
  const vehicle = useVehicleStore();
  
  return (
    <div className="vehicle-info-panel">
      {/* Vehicle Header */}
      <div className="info-header">
        <h2>Tesla Model 3</h2>
        <p className="text-sm text-gray-400">VIN: {vehicle.vin}</p>
        <p className="text-sm text-gray-400">Owner: {vehicle.owner}</p>
      </div>
      
      {/* Status Section */}
      <StatusSection title="System Status">
        <div className="status-item">
          <Battery className="status-icon" />
          <span>Battery</span>
          <span className="status-value">{vehicle.battery}%</span>
        </div>
        <div className="status-item">
          <Wifi className="status-icon" />
          <span>Network</span>
          <span className={`status-value ${vehicle.network_status === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
            {vehicle.network_status}
          </span>
        </div>
        <div className="status-item">
          <MapPin className="status-icon" />
          <span>GPS</span>
          <span className={`status-value ${vehicle.gps_status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
            {vehicle.gps_status}
          </span>
        </div>
        <div className="status-item">
          <Cpu className="status-icon" />
          <span>Firmware</span>
          <span className="status-value">{vehicle.firmware_version}</span>
        </div>
      </StatusSection>
      
      {/* Vehicle State */}
      <StatusSection title="Vehicle State">
        <div className="status-item">
          <span>🚪 Doors</span>
          <span className="status-value">{vehicle.doors_status}</span>
        </div>
        <div className="status-item">
          <span>🎒 Boot</span>
          <span className="status-value">{vehicle.boot_status}</span>
        </div>
        <div className="status-item">
          <span>🔥 Engine</span>
          <span className="status-value">{vehicle.engine_status}</span>
        </div>
        <div className="status-item">
          <span>💡 Lights</span>
          <span className="status-value">{vehicle.lights_status}</span>
        </div>
      </StatusSection>
      
      {/* Activity Log */}
      <ActivityLog activities={vehicle.activities} />
    </div>
  );
};
```

---

## Styling

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dashboard: '#0F0F14',
        panel: '#1A1A24',
        'primary-purple': '#6D28D9',
        'accent-purple': '#A855F7',
        success: '#10B981',
        warning: '#F59E0B',
        critical: '#EF4444',
        info: '#38BDF8'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
};
```

### Global Styles

```css
/* src/index.css */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: #0F0F14;
  color: #E5E7EB;
  overflow-x: hidden;
}

.dashboard-container {
  min-height: 100vh;
  padding: 24px;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 32px;
}

.dashboard-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #A855F7;
  margin-bottom: 8px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 24px;
  max-width: 1920px;
  margin: 0 auto;
}

@media (max-width: 1280px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1.5fr;
  }
  
  .controller-panel {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Backend Updates

### Additional API Endpoints

Add these endpoints to Phase 1 backend:

```python
# routes/vehicle_routes.py

@vehicle_bp.route('/<vin>/horn', methods=['POST'])
def activate_horn(vin):
    """Activate vehicle horn"""
    try:
        service = get_vehicle_service()
        result = service.activate_horn(vin)
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/horn', None, result, status_code)
        return jsonify(result), status_code
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/horn', None, error_response, 500)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>/lights/flash', methods=['POST'])
def flash_lights(vin):
    """Flash vehicle lights"""
    try:
        service = get_vehicle_service()
        result = service.flash_lights(vin)
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/lights/flash', None, result, status_code)
        return jsonify(result), status_code
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/lights/flash', None, error_response, 500)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>/boot/close', methods=['POST'])
def close_boot(vin):
    """Close vehicle boot"""
    try:
        service = get_vehicle_service()
        result = service.close_boot(vin)
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/boot/close', None, result, status_code)
        return jsonify(result), status_code
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/boot/close', None, error_response, 500)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>/engine/stop', methods=['POST'])
def stop_engine(vin):
    """Stop vehicle engine"""
    try:
        service = get_vehicle_service()
        result = service.stop_engine(vin)
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/engine/stop', None, result, status_code)
        return jsonify(result), status_code
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/engine/stop', None, error_response, 500)
        return jsonify(error_response), 500

@vehicle_bp.route('/<vin>/locate', methods=['POST'])
def locate_vehicle(vin):
    """Locate vehicle (GPS ping)"""
    try:
        service = get_vehicle_service()
        result = service.locate_vehicle(vin)
        
        status_code = 200 if result['success'] else 404
        log_api_call('POST', f'/api/vehicles/{vin}/locate', None, result, status_code)
        return jsonify(result), status_code
    except Exception as e:
        error_response = {'success': False, 'error': str(e)}
        log_api_call('POST', f'/api/vehicles/{vin}/locate', None, error_response, 500)
        return jsonify(error_response), 500
```

### Vehicle Service Updates

```python
# services/vehicle_service.py

def activate_horn(self, vin: str) -> dict:
    """Activate vehicle horn"""
    vehicle = self.get_vehicle_by_vin(vin)
    if not vehicle:
        return {'success': False, 'message': 'Vehicle not found'}
    
    # Send CAN frame
    self.can_service.send_horn(vin)
    
    # Update vehicle state
    vehicle.horn_on()
    self.update_vehicle_state(vin, {'horn_status': 'on'})
    
    # Log event
    self.logging_service.log_event('HORN_ACTIVATED', f'Vehicle {vin} horn activated')
    
    # Broadcast update
    self.broadcast_vehicle_update(vehicle)
    
    # Auto-deactivate after 2 seconds
    import threading
    def deactivate():
        vehicle.horn_off()
        self.update_vehicle_state(vin, {'horn_status': 'off'})
        self.broadcast_vehicle_update(vehicle)
    
    threading.Timer(2.0, deactivate).start()
    
    return {'success': True, 'message': 'Horn activated', 'vehicle': vehicle.to_dict()}

def flash_lights(self, vin: str) -> dict:
    """Flash vehicle lights"""
    vehicle = self.get_vehicle_by_vin(vin)
    if not vehicle:
        return {'success': False, 'message': 'Vehicle not found'}
    
    # Send CAN frame
    self.can_service.send_lights_flash(vin)
    
    # Log event
    self.logging_service.log_event('LIGHTS_FLASH', f'Vehicle {vin} lights flashed')
    
    # Broadcast update
    self.broadcast_vehicle_update(vehicle)
    
    return {'success': True, 'message': 'Lights flashed', 'vehicle': vehicle.to_dict()}

def close_boot(self, vin: str) -> dict:
    """Close vehicle boot"""
    vehicle = self.get_vehicle_by_vin(vin)
    if not vehicle:
        return {'success': False, 'message': 'Vehicle not found'}
    
    # Send CAN frame
    self.can_service.send_boot_close(vin)
    
    # Update vehicle state
    vehicle.close_boot()
    self.update_vehicle_state(vin, {'boot_status': 'closed'})
    
    # Log event
    self.logging_service.log_event('BOOT_CLOSE', f'Vehicle {vin} boot closed')
    
    # Broadcast update
    self.broadcast_vehicle_update(vehicle)
    
    return {'success': True, 'message': 'Boot closed', 'vehicle': vehicle.to_dict()}

def stop_engine(self, vin: str) -> dict:
    """Stop vehicle engine"""
    vehicle = self.get_vehicle_by_vin(vin)
    if not vehicle:
        return {'success': False, 'message': 'Vehicle not found'}
    
    # Send CAN frame
    self.can_service.send_engine_stop(vin)
    
    # Update vehicle state
    vehicle.stop_engine()
    self.update_vehicle_state(vin, {'engine_status': 'off'})
    
    # Log event
    self.logging_service.log_event('ENGINE_STOP', f'Vehicle {vin} engine stopped')
    
    # Broadcast update
    self.broadcast_vehicle_update(vehicle)
    
    return {'success': True, 'message': 'Engine stopped', 'vehicle': vehicle.to_dict()}

def locate_vehicle(self, vin: str) -> dict:
    """Locate vehicle (GPS ping)"""
    vehicle = self.get_vehicle_by_vin(vin)
    if not vehicle:
        return {'success': False, 'message': 'Vehicle not found'}
    
    # Send CAN frame
    self.can_service.send_gps_ping(vin)
    
    # Log event
    self.logging_service.log_event('GPS_LOCATE', f'Vehicle {vin} location requested')
    
    # Broadcast update
    self.broadcast_vehicle_update(vehicle)
    
    return {
        'success': True, 
        'message': 'Vehicle located', 
        'vehicle': vehicle.to_dict(),
        'location': {
            'lat': 37.7749,  # Mock location
            'lng': -122.4194
        }
    }
```

---

## Implementation Roadmap

### Week 1: Frontend Setup & Dashboard Layout
- [ ] Initialize Vite + React + TypeScript project
- [ ] Setup Tailwind CSS
- [ ] Install dependencies (Framer Motion, Socket.IO, Zustand)
- [ ] Create Dashboard component
- [ ] Implement 3-column layout
- [ ] Add responsive breakpoints

### Week 2: Google Pixel Controller
- [ ] Design phone frame component
- [ ] Create control button component
- [ ] Implement all control sections
- [ ] Add loading states
- [ ] Connect to API service
- [ ] Test all controls

### Week 3: Vehicle Digital Twin
- [ ] Create base vehicle SVG
- [ ] Implement door components
- [ ] Add trunk component
- [ ] Create headlight/taillight components
- [ ] Add horn effect
- [ ] Implement all animations

### Week 4: Vehicle Info Panel
- [ ] Create info panel layout
- [ ] Implement status sections
- [ ] Add activity log
- [ ] Connect to vehicle store
- [ ] Add real-time updates

### Week 5: State Management & Socket.IO
- [ ] Setup Zustand store
- [ ] Implement Socket.IO integration
- [ ] Create useSocketIO hook
- [ ] Test real-time synchronization
- [ ] Handle connection states

### Week 6: Backend Updates
- [ ] Add new API endpoints
- [ ] Update vehicle service
- [ ] Add CAN service methods
- [ ] Test all endpoints
- [ ] Verify CAN frame generation

### Week 7: Integration & Testing
- [ ] Connect all components
- [ ] Test complete flow
- [ ] Fix bugs
- [ ] Optimize performance
- [ ] Test on multiple devices

### Week 8: Polish & Documentation
- [ ] Refine animations
- [ ] Improve responsiveness
- [ ] Add error handling
- [ ] Write documentation
- [ ] Create demo video

**Total Timeline:** 8 weeks

---

## Acceptance Criteria

Phase 2 is complete when:

### Functional Requirements
- [ ] Google Pixel controller is fully functional
- [ ] All control buttons work correctly
- [ ] Vehicle Digital Twin updates in real-time
- [ ] Vehicle Info Panel updates in real-time
- [ ] API requests are generated for all actions
- [ ] CAN frames are generated for all actions
- [ ] candump displays generated traffic (Linux)
- [ ] Logs are created automatically
- [ ] SocketIO synchronization works
- [ ] No page refreshes needed

### Visual Requirements
- [ ] Dashboard looks professional (OEM-grade)
- [ ] Phone frame looks realistic
- [ ] Vehicle Twin animations are smooth (60fps)
- [ ] Responsive design works on all devices
- [ ] Color scheme is consistent
- [ ] Typography is professional

### Performance Requirements
- [ ] Initial load < 3s
- [ ] State updates < 50ms
- [ ] Animations run at 60fps
- [ ] No memory leaks
- [ ] Smooth on mobile devices

### User Experience
- [ ] Entire flow from mobile app to vehicle is visible
- [ ] Dashboard feels like a connected vehicle platform
- [ ] Controls are intuitive
- [ ] Feedback is immediate
- [ ] Errors are handled gracefully

---

## Success Metrics

- **User can control vehicle** through mobile interface
- **Vehicle responds** to all commands
- **State synchronization** works flawlessly
- **CAN frames** are generated correctly
- **Logs** capture all activity
- **Dashboard** looks professional
- **Performance** meets targets

---

## Out of Scope (Future Phases)

**NOT included in Phase 2:**
- Attack simulations
- Infotainment system
- API traffic monitor
- CAN traffic monitor
- Impact analysis
- Logs viewer pages
- Security event visualizations
- Multiple vehicles
- User authentication

These will be implemented in later phases.

---

## Deliverables

### Code
- [ ] Complete frontend application
- [ ] Updated backend endpoints
- [ ] Updated vehicle service
- [ ] All components implemented
- [ ] Tests written

### Documentation
- [ ] Setup instructions
- [ ] Component documentation
- [ ] API documentation updates
- [ ] User guide
- [ ] Developer guide

### Assets
- [ ] Vehicle SVG
- [ ] Phone frame design
- [ ] Icons
- [ ] Screenshots
- [ ] Demo video

---

## Getting Started

### Prerequisites
- Phase 1 backend running
- Node.js 18+
- npm or yarn
- Modern browser

### Quick Start

```bash
# Create frontend project
npm create vite@latest frontend -- --template react-ts

# Install dependencies
cd frontend
npm install
npm install framer-motion socket.io-client zustand lucide-react

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start development
npm run dev
```

---

**Phase 2 Specification Complete** ✅

*Ready for implementation - Professional Connected Vehicle Dashboard*

🚗📱💻✨
