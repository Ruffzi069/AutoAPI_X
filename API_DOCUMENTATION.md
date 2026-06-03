# AutoAPI-X - API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## System Endpoints

### Get System Status

**Endpoint:** `GET /api/system/status`

**Description:** Returns system health status, component status, and statistics.

**Request:**
```bash
curl http://localhost:5000/api/system/status
```

**Response:** `200 OK`
```json
{
  "success": true,
  "status": "online",
  "timestamp": "2026-06-02T10:30:00.123456",
  "platform": "AutoAPI-X",
  "version": "1.0.0-phase1",
  "components": {
    "api_server": "running",
    "database": "connected",
    "can_interface": "initialized",
    "socketio": "active"
  },
  "statistics": {
    "recent_api_calls": 10,
    "recent_can_frames": 5,
    "recent_events": 8
  }
}
```

---

## Vehicle Endpoints

### Get All Vehicles

**Endpoint:** `GET /api/vehicles`

**Description:** Returns a list of all vehicles in the system.

**Request:**
```bash
curl http://localhost:5000/api/vehicles
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 1,
  "vehicles": [
    {
      "id": 1,
      "vin": "5YJ3E1EA1KF000001",
      "owner": "User A",
      "battery": 84,
      "doors_status": "locked",
      "boot_status": "closed",
      "horn_status": "off",
      "engine_status": "off",
      "lights_status": "off",
      "gps_status": "active",
      "infotainment_status": "online",
      "firmware_version": "v1.2.3",
      "network_status": "connected",
      "created_at": "2026-06-02T10:00:00"
    }
  ]
}
```

---

### Get Vehicle by VIN

**Endpoint:** `GET /api/vehicles/<vin>`

**Description:** Returns detailed information about a specific vehicle.

**Parameters:**
- `vin` (path) - Vehicle Identification Number

**Request:**
```bash
curl http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001
```

**Response:** `200 OK`
```json
{
  "success": true,
  "vehicle": {
    "id": 1,
    "vin": "5YJ3E1EA1KF000001",
    "owner": "User A",
    "battery": 84,
    "doors_status": "locked",
    "boot_status": "closed",
    "horn_status": "off",
    "engine_status": "off",
    "lights_status": "off",
    "gps_status": "active",
    "infotainment_status": "online",
    "firmware_version": "v1.2.3",
    "network_status": "connected",
    "created_at": "2026-06-02T10:00:00"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Vehicle not found"
}
```

---

### Lock Vehicle

**Endpoint:** `POST /api/vehicles/<vin>/lock`

**Description:** Locks the vehicle doors. Generates CAN frame 0x321 with command 0x01.

**Parameters:**
- `vin` (path) - Vehicle Identification Number

**CAN Frame Generated:**
```
CAN ID: 0x321 (Door ECU)
Data: [0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
Source: API_Gateway
Destination: Door_ECU
```

**Request:**
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/lock
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Vehicle locked",
  "vehicle": {
    "id": 1,
    "vin": "5YJ3E1EA1KF000001",
    "doors_status": "locked",
    ...
  }
}
```

**Side Effects:**
- Vehicle `doors_status` updated to `"locked"`
- CAN frame transmitted on vcan0
- API log entry created
- CAN log entry created
- Event log entry created
- SocketIO `vehicle_updates` event broadcast

---

### Unlock Vehicle

**Endpoint:** `POST /api/vehicles/<vin>/unlock`

**Description:** Unlocks the vehicle doors. Generates CAN frame 0x321 with command 0x02.

**Parameters:**
- `vin` (path) - Vehicle Identification Number

**CAN Frame Generated:**
```
CAN ID: 0x321 (Door ECU)
Data: [0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
Source: API_Gateway
Destination: Door_ECU
```

**Request:**
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/unlock
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Vehicle unlocked",
  "vehicle": {
    "id": 1,
    "vin": "5YJ3E1EA1KF000001",
    "doors_status": "unlocked",
    ...
  }
}
```

**Side Effects:**
- Vehicle `doors_status` updated to `"unlocked"`
- CAN frame transmitted on vcan0
- API log entry created
- CAN log entry created
- Event log entry created
- SocketIO `vehicle_updates` event broadcast

---

### Open Boot

**Endpoint:** `POST /api/vehicles/<vin>/boot/open`

**Description:** Opens the vehicle boot/trunk. Generates CAN frame 0x323 with command 0x03.

**Parameters:**
- `vin` (path) - Vehicle Identification Number

**CAN Frame Generated:**
```
CAN ID: 0x323 (Boot ECU)
Data: [0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
Source: API_Gateway
Destination: Boot_ECU
```

**Request:**
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/boot/open
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Boot opened",
  "vehicle": {
    "id": 1,
    "vin": "5YJ3E1EA1KF000001",
    "boot_status": "open",
    ...
  }
}
```

**Side Effects:**
- Vehicle `boot_status` updated to `"open"`
- CAN frame transmitted on vcan0
- API log entry created
- CAN log entry created
- Event log entry created
- SocketIO `vehicle_updates` event broadcast

---

### Start Engine

**Endpoint:** `POST /api/vehicles/<vin>/engine/start`

**Description:** Starts the vehicle engine. Generates CAN frame 0x324 with command 0x05.

**Parameters:**
- `vin` (path) - Vehicle Identification Number

**CAN Frame Generated:**
```
CAN ID: 0x324 (Ignition ECU)
Data: [0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
Source: API_Gateway
Destination: Ignition_ECU
```

**Request:**
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/engine/start
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Engine started",
  "vehicle": {
    "id": 1,
    "vin": "5YJ3E1EA1KF000001",
    "engine_status": "on",
    ...
  }
}
```

**Side Effects:**
- Vehicle `engine_status` updated to `"on"`
- CAN frame transmitted on vcan0
- API log entry created
- CAN log entry created
- Event log entry created
- SocketIO `vehicle_updates` event broadcast

---

## ECU Mappings

| ECU Name | CAN ID | Function | Commands |
|----------|--------|----------|----------|
| Door ECU | 0x321 | Door lock/unlock | 0x01 (lock), 0x02 (unlock) |
| Horn ECU | 0x322 | Horn activation | 0x07 (on), 0x08 (off) |
| Boot ECU | 0x323 | Boot open/close | 0x03 (open), 0x04 (close) |
| Ignition ECU | 0x324 | Engine start/stop | 0x05 (start), 0x06 (stop) |
| Lights ECU | 0x325 | Lights control | 0x07 (on), 0x08 (off) |
| GPS ECU | 0x327 | GPS tracking | 0x07 (on), 0x08 (off) |
| Infotainment ECU | 0x400 | Infotainment system | 0x07 (online), 0x08 (offline) |

---

## CAN Frame Structure

All CAN frames follow this structure:

```
┌─────────────┬──────────────────────────────────────────┐
│  CAN ID     │  Data (8 bytes)                          │
│  (11-bit)   │  [CMD, B1, B2, B3, B4, B5, B6, B7]      │
└─────────────┴──────────────────────────────────────────┘
```

**Example: Unlock Command**
```
CAN ID: 0x321
Data: [0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
       └─┬─┘  └──────────────┬──────────────────────┘
      Command    Padding (unused)
```

---

## SocketIO Events

### Connection

**Event:** `connect`

**Description:** Client connected to SocketIO server.

**Client Code:**
```javascript
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to AutoAPI-X');
});
```

---

### Vehicle Updates

**Event:** `vehicle_updates`

**Description:** Broadcast when vehicle state changes.

**Payload:**
```json
{
  "id": 1,
  "vin": "5YJ3E1EA1KF000001",
  "doors_status": "unlocked",
  "boot_status": "closed",
  "engine_status": "off",
  ...
}
```

**Client Code:**
```javascript
socket.on('vehicle_updates', (data) => {
  console.log('Vehicle updated:', data);
  // Update UI with new vehicle state
});
```

---

### CAN Updates (Future)

**Event:** `can_updates`

**Description:** Broadcast when CAN frame is transmitted.

**Payload:**
```json
{
  "can_id": "0x321",
  "source_ecu": "API_Gateway",
  "destination_ecu": "Door_ECU",
  "payload": "0200000000000000",
  "timestamp": "2026-06-02T10:30:00.123456"
}
```

---

### API Updates (Future)

**Event:** `api_updates`

**Description:** Broadcast when API request is processed.

---

### Event Updates (Future)

**Event:** `event_updates`

**Description:** Broadcast when system event occurs.

---

## Error Responses

### 404 Not Found

**Scenario:** Vehicle with specified VIN does not exist.

```json
{
  "success": false,
  "message": "Vehicle not found"
}
```

---

### 500 Internal Server Error

**Scenario:** Server error during request processing.

```json
{
  "success": false,
  "error": "Error message details"
}
```

---

## Rate Limiting

**Phase 1:** No rate limiting implemented.

**Future Phases:** Rate limiting will be added for security demonstrations.

---

## Authentication

**Phase 1:** No authentication required.

**Future Phases:** Authentication and authorization will be added for security demonstrations.

---

## Testing with curl

### Complete Test Sequence

```bash
# 1. Check system status
curl http://localhost:5000/api/system/status

# 2. Get all vehicles
curl http://localhost:5000/api/vehicles

# 3. Get specific vehicle
curl http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001

# 4. Unlock vehicle
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/unlock

# 5. Open boot
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/boot/open

# 6. Start engine
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/engine/start

# 7. Lock vehicle
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/lock
```

---

## Testing with Python

```python
import requests

BASE_URL = "http://localhost:5000/api"
VIN = "5YJ3E1EA1KF000001"

# Get system status
response = requests.get(f"{BASE_URL}/system/status")
print(response.json())

# Get all vehicles
response = requests.get(f"{BASE_URL}/vehicles")
print(response.json())

# Unlock vehicle
response = requests.post(f"{BASE_URL}/vehicles/{VIN}/unlock")
print(response.json())

# Start engine
response = requests.post(f"{BASE_URL}/vehicles/{VIN}/engine/start")
print(response.json())
```

---

## Monitoring CAN Traffic

While making API calls, monitor CAN traffic in a separate terminal:

```bash
candump vcan0
```

**Expected Output:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00    # Unlock
vcan0  323   [8]  03 00 00 00 00 00 00 00    # Boot open
vcan0  324   [8]  05 00 00 00 00 00 00 00    # Engine start
vcan0  321   [8]  01 00 00 00 00 00 00 00    # Lock
```

---

## Database Logs

All API calls, CAN frames, and events are logged to the SQLite database.

**Query API Logs:**
```sql
SELECT * FROM api_logs ORDER BY timestamp DESC LIMIT 10;
```

**Query CAN Logs:**
```sql
SELECT * FROM can_logs ORDER BY timestamp DESC LIMIT 10;
```

**Query Event Logs:**
```sql
SELECT * FROM event_logs ORDER BY timestamp DESC LIMIT 10;
```

---

## Future Endpoints (Planned)

### Phase 2+
- `POST /api/vehicles/<vin>/horn` - Activate horn
- `POST /api/vehicles/<vin>/lights/on` - Turn on lights
- `POST /api/vehicles/<vin>/lights/off` - Turn off lights
- `GET /api/vehicles/<vin>/location` - Get GPS location
- `POST /api/vehicles/<vin>/climate` - Control climate
- `GET /api/logs/api` - Get API logs
- `GET /api/logs/can` - Get CAN logs
- `GET /api/logs/events` - Get event logs

### Phase 4 (Attack Simulation)
- `POST /api/attacks/replay` - Replay attack
- `POST /api/attacks/fuzzing` - Fuzzing attack
- `POST /api/attacks/mitm` - Man-in-the-middle attack
- `GET /api/attacks/history` - Attack history

---

**API Documentation for AutoAPI-X Phase 1** ✅
