# AutoAPI-X - System Architecture

## Phase 1: Backend Foundation Architecture

### Overview

AutoAPI-X follows a **service-oriented architecture** with clear separation of concerns. The system is designed to simulate how real connected vehicles process API requests and translate them into CAN bus commands.

---

## Core Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER / CLIENT                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST API Request
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FLASK APPLICATION                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    API Routes Layer                       │   │
│  │  • vehicle_routes.py  (Vehicle operations)               │   │
│  │  • system_routes.py   (System status)                    │   │
│  └────────────────────┬─────────────────────────────────────┘   │
│                       │                                          │
│                       │ Delegates to Services                    │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Service Layer                           │   │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────┐ │   │
│  │  │ Vehicle Service│  │  CAN Service   │  │  Logging   │ │   │
│  │  │                │  │                │  │  Service   │ │   │
│  │  │ • State Mgmt   │  │ • Frame Gen    │  │            │ │   │
│  │  │ • Validation   │  │ • ECU Mapping  │  │ • API Logs │ │   │
│  │  │ • Orchestration│  │ • Transmission │  │ • CAN Logs │ │   │
│  │  └────────┬───────┘  └────────┬───────┘  │ • Events   │ │   │
│  │           │                   │           └──────┬─────┘ │   │
│  └───────────┼───────────────────┼──────────────────┼───────┘   │
│              │                   │                  │            │
└──────────────┼───────────────────┼──────────────────┼────────────┘
               │                   │                  │
               │                   │                  │
    ┌──────────▼──────────┐ ┌──────▼──────────┐ ┌───▼──────────┐
    │   SQLite Database   │ │  SocketCAN      │ │  SocketIO    │
    │                     │ │  (vcan0)        │ │  (Real-time) │
    │ • vehicles          │ │                 │ │              │
    │ • users             │ │ CAN Frames:     │ │ Events:      │
    │ • api_logs          │ │ • 0x321 Door    │ │ • vehicle_   │
    │ • can_logs          │ │ • 0x322 Horn    │ │   updates    │
    │ • event_logs        │ │ • 0x323 Boot    │ │ • can_       │
    └─────────────────────┘ │ • 0x324 Engine  │ │   updates    │
                            │ • 0x325 Lights  │ │ • api_       │
                            │ • 0x327 GPS     │ │   updates    │
                            │ • 0x400 Info    │ │ • event_     │
                            └─────────────────┘ │   updates    │
                                                └──────────────┘
```

---

## Request Flow Example: Unlock Vehicle

```
1. Client Request
   POST /api/vehicles/5YJ3E1EA1KF000001/unlock
   │
   ▼
2. Route Handler (vehicle_routes.py)
   • Receives request
   • Extracts VIN from URL
   • Calls VehicleService.unlock_vehicle(vin)
   │
   ▼
3. Vehicle Service (vehicle_service.py)
   • Retrieves vehicle from database
   • Validates vehicle exists
   • Calls CANService.send_door_unlock(vin)
   • Updates vehicle state: doors_status = 'unlocked'
   • Saves to database
   • Logs event
   • Broadcasts SocketIO update
   │
   ▼
4. CAN Service (can_service.py)
   • Calls SocketCANManager.send_door_unlock()
   • Logs CAN event
   │
   ▼
5. SocketCAN Manager (socketcan_manager.py)
   • Creates CAN frame: ID=0x321, Data=[0x02, 0x00, ...]
   • Sends frame to vcan0
   • Returns frame metadata
   │
   ▼
6. Parallel Actions
   ├─► Database: api_logs, can_logs, event_logs updated
   ├─► SocketIO: vehicle_updates event broadcast
   └─► CAN Bus: Frame visible in candump
   │
   ▼
7. Response to Client
   {
     "success": true,
     "message": "Vehicle unlocked",
     "vehicle": { ... }
   }
```

---

## Component Responsibilities

### 1. Routes Layer (`routes/`)

**Purpose:** Thin controllers that handle HTTP requests/responses

**Responsibilities:**
- Receive HTTP requests
- Extract parameters
- Delegate to services
- Format responses
- Handle HTTP errors
- Log API calls

**Files:**
- `vehicle_routes.py` - Vehicle operation endpoints
- `system_routes.py` - System status endpoints

---

### 2. Service Layer (`services/`)

**Purpose:** Business logic and orchestration

#### Vehicle Service (`vehicle_service.py`)
- Manage vehicle state
- Coordinate between CAN, logging, and database
- Validate operations
- Broadcast real-time updates

#### CAN Service (`can_service.py`)
- Abstract CAN operations
- Map vehicle actions to CAN frames
- Log CAN events
- Handle CAN errors

#### Logging Service (`logging_service.py`)
- Centralized logging
- API request/response logging
- CAN frame logging
- System event logging

---

### 3. Models Layer (`models/`)

**Purpose:** Data structures and domain objects

#### Vehicle Model (`vehicle.py`)
- Vehicle state representation
- State transition methods
- Database serialization

#### User Model (`user.py`)
- User/owner representation
- Role management

---

### 4. CAN Layer (`can/`)

**Purpose:** Low-level CAN bus communication

#### SocketCAN Manager (`socketcan_manager.py`)
- Direct interface to vcan0
- CAN frame construction
- ECU ID mapping
- Frame transmission
- Graceful fallback when CAN unavailable

**ECU Mappings:**
```python
ECU_DOOR         = 0x321  # Door lock/unlock
ECU_HORN         = 0x322  # Horn activation
ECU_BOOT         = 0x323  # Boot open/close
ECU_IGNITION     = 0x324  # Engine start/stop
ECU_LIGHTS       = 0x325  # Lights control
ECU_GPS          = 0x327  # GPS tracking
ECU_INFOTAINMENT = 0x400  # Infotainment system
```

---

### 5. Database Layer (`database/`)

**Purpose:** Data persistence

#### Schema:

**users**
- id, username, role, created_at

**vehicles**
- id, vin, owner, battery, doors_status, boot_status, horn_status, engine_status, lights_status, gps_status, infotainment_status, firmware_version, network_status, created_at

**api_logs**
- id, timestamp, method, endpoint, request_data, response_data, status_code

**can_logs**
- id, timestamp, can_id, source_ecu, destination_ecu, payload

**event_logs**
- id, timestamp, event_type, description

---

### 6. Configuration (`config/`)

**Purpose:** Centralized configuration management

- Flask settings
- Database paths
- CAN interface settings
- Logging directories
- SocketIO configuration

---

## Data Flow Patterns

### Pattern 1: Read Operation
```
Client → Route → Service → Database → Service → Route → Client
```

### Pattern 2: Write Operation
```
Client → Route → Service → [CAN + Database + Logging + SocketIO] → Route → Client
```

### Pattern 3: Real-time Update
```
Service → SocketIO → Connected Clients (Future Frontend)
```

---

## Scalability Considerations

### Modular Design
- Each component has single responsibility
- Easy to add new ECUs
- Easy to add new vehicle actions
- Easy to add new endpoints

### Future Expansion Points

1. **New Vehicle Actions**
   - Add method to Vehicle model
   - Add method to VehicleService
   - Add CAN frame method to SocketCANManager
   - Add route endpoint

2. **New ECUs**
   - Add ECU ID constant
   - Add frame generation method
   - Add service method

3. **Attack Simulation** (Phase 4)
   - Add `attacks/` modules
   - Inject malicious CAN frames
   - Monitor impact on vehicle state

4. **Analytics** (Phase 5)
   - Add `analytics/` modules
   - Query logs for patterns
   - Generate reports

---

## Security Architecture (Future)

### Phase 1: Foundation (Current)
- Basic logging
- State management
- CAN frame generation

### Phase 4: Attack Simulation
- Replay attacks
- Fuzzing
- Man-in-the-middle
- Unauthorized access

### Phase 6: Secure vs Vulnerable
- Authentication layer
- Authorization checks
- Encrypted CAN frames
- Rate limiting
- Anomaly detection

---

## Technology Choices

### Why Flask?
- Lightweight and flexible
- Easy to extend
- Good for educational purposes
- Excellent ecosystem

### Why SQLite?
- Zero configuration
- Embedded database
- Perfect for development/demo
- Easy to inspect and debug

### Why SocketCAN?
- Industry standard for Linux CAN
- Compatible with real CAN hardware
- Excellent tooling (candump, cansend)
- Educational value

### Why SocketIO?
- Real-time bidirectional communication
- Easy frontend integration
- Event-based architecture
- Wide browser support

---

## Development Principles

1. **Separation of Concerns**
   - Routes handle HTTP
   - Services handle business logic
   - Models handle data
   - CAN layer handles hardware

2. **Single Responsibility**
   - Each module has one clear purpose
   - Easy to test and maintain

3. **Dependency Injection**
   - Services receive dependencies
   - Easy to mock for testing

4. **Fail Gracefully**
   - CAN unavailable? Simulate it
   - Database error? Return proper error
   - Invalid request? Clear error message

5. **Log Everything**
   - Every API call logged
   - Every CAN frame logged
   - Every state change logged

---

## Phase 1 Deliverables

✅ Modular backend architecture  
✅ RESTful API endpoints  
✅ CAN frame generation  
✅ Database persistence  
✅ Real-time communication infrastructure  
✅ Comprehensive logging  
✅ Demo vehicle and data  
✅ Documentation  

---

## Next Phases

### Phase 2: Vehicle Digital Twin
- Enhanced vehicle simulation
- Google Pixel controller integration
- Mobile app interface

### Phase 3: Monitoring Dashboards
- Real-time CAN traffic visualization
- API traffic monitoring
- Vehicle state dashboard

### Phase 4: Attack Simulation
- Attack scenario library
- Vulnerability demonstrations
- Impact analysis

---

**Architecture designed for education, research, and extensibility.**
