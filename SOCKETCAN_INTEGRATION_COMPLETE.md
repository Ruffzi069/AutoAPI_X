# SocketCAN Integration - Real CAN Traffic Implementation

**Status:** ✅ Complete  
**Date:** June 3, 2026  
**Platform:** Linux with SocketCAN (vcan0)  
**Library:** python-can

---

## Overview

AutoAPI-X now generates **real CAN frames** transmitted to the SocketCAN interface (`vcan0`) that can be observed with Linux SocketCAN tools like `candump vcan0`.

The platform is no longer displaying simulated CAN logs - all CAN traffic in the UI reflects actual frames sent to the vcan0 interface.

---

## CAN ID Mapping (Updated to Specification)

### Vehicle Commands

| Command | CAN ID | Payload | ECU |
|---------|--------|---------|-----|
| **Lock Vehicle** | `0x321` | `01 00 00 00 00 00 00 00` | Door ECU |
| **Unlock Vehicle** | `0x321` | `02 00 00 00 00 00 00 00` | Door ECU |
| **Horn** | `0x320` | `01 00 00 00 00 00 00 00` | Horn ECU |
| **Flash Lights** | `0x322` | `01 00 00 00 00 00 00 00` | Lights ECU |
| **Start Engine** | `0x400` | `01 00 00 00 00 00 00 00` | Ignition ECU |
| **Stop Engine** | `0x400` | `00 00 00 00 00 00 00 00` | Ignition ECU |
| **Open Boot** | `0x330` | `01 00 00 00 00 00 00 00` | Boot ECU |
| **Close Boot** | `0x330` | `00 00 00 00 00 00 00 00` | Boot ECU |
| **Locate Vehicle** | `0x500` | `47 50 53 00 00 00 00 00` | GPS ECU |

### Infotainment & Services

| Command | CAN ID | Description |
|---------|--------|-------------|
| **Infotainment Events** | `0x600` | Media, navigation, phone sync |
| **OTA Events** | `0x700` | Firmware updates, OTA operations |

---

## Implementation Details

### SocketCAN Manager
**File:** `backend/can/socketcan_manager.py`

**Key Features:**
- Uses `python-can` library
- Interface: `socketcan`
- Channel: `vcan0`
- Bitrate: 500000 (500 kbit/s)
- Platform detection (Linux/Windows)
- Simulation fallback for Windows

### Initialization

```python
from can import Message
import can

bus = can.Bus(interface='socketcan', channel='vcan0', bitrate=500000)
```

### Frame Transmission

Every vehicle command now:
1. Creates a `can.Message` with proper arbitration ID
2. Populates 8-byte data payload
3. Sends to vcan0 using `bus.send(message)`
4. Returns frame metadata for logging

**Example - Door Unlock:**
```python
def send_door_unlock(self):
    data = bytes([0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
    message = can.Message(
        arbitration_id=0x321,
        data=data,
        is_extended_id=False
    )
    self.bus.send(message)
    return {
        'can_id': '0x321',
        'source_ecu': 'API_Gateway',
        'destination_ecu': 'Door_ECU',
        'payload': '0200000000000000',
        'timestamp': datetime.now().isoformat()
    }
```

---

## Validation Commands

### Setup vcan0 (Linux)

```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

### Monitor CAN Traffic

```bash
candump vcan0
```

### Expected Output

**Unlock Vehicle:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00
```

**Lock Vehicle:**
```
vcan0  321   [8]  01 00 00 00 00 00 00 00
```

**Horn:**
```
vcan0  320   [8]  01 00 00 00 00 00 00 00
```

**Flash Lights:**
```
vcan0  322   [8]  01 00 00 00 00 00 00 00
```

**Start Engine:**
```
vcan0  400   [8]  01 00 00 00 00 00 00 00
```

**Stop Engine:**
```
vcan0  400   [8]  00 00 00 00 00 00 00 00
```

**Open Boot:**
```
vcan0  330   [8]  01 00 00 00 00 00 00 00
```

**Close Boot:**
```
vcan0  330   [8]  00 00 00 00 00 00 00 00
```

**Locate Vehicle:**
```
vcan0  500   [8]  47 50 53 00 00 00 00 00
```
*(Note: `47 50 53` = ASCII "GPS")*

**OTA Check:**
```
vcan0  700   [8]  30 00 00 00 00 00 00 00
```

**Infotainment Play:**
```
vcan0  600   [8]  10 01 00 00 00 00 00 00
```

---

## Vehicle Service Integration

### Vehicle Routes
**File:** `backend/routes/vehicle_routes.py`

All vehicle commands now trigger real CAN frames:
- `POST /api/vehicles/{vin}/lock` → `send_door_lock()`
- `POST /api/vehicles/{vin}/unlock` → `send_door_unlock()`
- `POST /api/vehicles/{vin}/horn` → `send_horn()`
- `POST /api/vehicles/{vin}/lights` → `send_lights_flash()`
- `POST /api/vehicles/{vin}/engine/start` → `send_engine_start()`
- `POST /api/vehicles/{vin}/engine/stop` → `send_engine_stop()`
- `POST /api/vehicles/{vin}/locate` → `send_gps_locate()`

### Infotainment Routes
**File:** `backend/routes/infotainment_routes.py`

All infotainment commands trigger CAN frames:
- Media control → CAN ID `0x600`
- Navigation → CAN ID `0x500`
- OTA operations → CAN ID `0x700`
- Phone sync → CAN ID `0x600`

---

## Attack Simulation Integration

Attack simulations now generate **real CAN traffic** on vcan0:

### IDOR Attack
**Affected CAN IDs:**
- `0x321` - Unauthorized door unlock
- `0x500` - GPS location access

### Replay Attack
**Behavior:**
- Captures previous CAN frame from vcan0
- Re-sends frame multiple times
- Observable with `candump vcan0`

### Broken Authentication
**Affected CAN IDs:**
- `0x320` - Horn activation without auth
- `0x322` - Lights control without auth
- `0x600` - Infotainment access without auth

### OTA Manipulation
**Affected CAN IDs:**
- `0x700` - OTA check, download, install
- `0x600` - Infotainment ECU updates

### Rate Limiting Failure
**Behavior:**
- Floods vcan0 with repeated frames
- Multiple rapid transmissions
- Overwhelms CAN bus

### Excessive Data Exposure
**Note:** Primarily API-level attack, minimal CAN involvement

---

## CAN Monitor UI Integration

The CAN Traffic Monitor UI now displays **real frames** captured from the SocketCAN manager rather than simulated entries.

**Data Flow:**
1. User triggers vehicle command
2. Backend generates CAN frame
3. Frame sent to vcan0 via python-can
4. Frame metadata returned to API
5. Socket.IO broadcasts frame to frontend
6. CAN Monitor UI displays actual frame

**Frontend Display:**
- CAN ID (hex)
- Source ECU
- Destination ECU
- Payload (hex)
- Timestamp
- Transaction ID

---

## Platform Support

### Linux (Production)
✅ **Real SocketCAN Integration**
- Uses vcan0 interface
- Transmits actual CAN frames
- Observable with `candump`, `cansniffer`, `cangen`
- Full python-can support

### Windows (Development)
✅ **Simulation Mode**
- Detects Windows platform automatically
- Logs CAN frames to console
- Does not require SocketCAN interface
- CAN Monitor UI still functions
- Useful for development and testing

**Detection Logic:**
```python
if platform.system() == 'Windows':
    print("✓ Running on Windows - CAN simulation mode enabled")
    self.simulation_mode = True
else:
    # Initialize real SocketCAN interface
    self.bus = can.Bus(interface='socketcan', channel='vcan0')
```

---

## Dependencies

### Backend Requirements
**File:** `backend/requirements.txt`

```
python-can>=4.0.0
```

### Installation (Linux)

```bash
pip install python-can
```

### System Requirements (Linux)

```bash
# Load SocketCAN kernel module
sudo modprobe vcan

# Create virtual CAN interface
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0

# Verify interface
ifconfig vcan0
```

---

## Testing Procedure

### 1. Start Backend

```bash
cd backend
python run.py
```

**Expected Output:**
```
✓ CAN interface 'vcan0' initialized successfully
✓ Starting AutoAPI-X Backend
✓ WebSocket server running on http://localhost:5000
```

### 2. Start CAN Monitor

Open a second terminal:

```bash
candump vcan0
```

### 3. Trigger Vehicle Command

Use the AutoAPI-X dashboard or API:

```bash
curl -X POST http://localhost:5000/api/vehicles/TESLA001/unlock
```

### 4. Observe CAN Traffic

**Terminal 1 (Backend):**
```
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
```

**Terminal 2 (candump):**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00
```

### 5. Verify UI

Open AutoAPI-X Dashboard:
- Vehicle state updates
- CAN Monitor shows frame
- API Monitor shows request
- Activity feed shows event

---

## API Response Format

When a vehicle command is executed, the API returns:

```json
{
  "success": true,
  "message": "Vehicle unlocked",
  "can_frame": {
    "can_id": "0x321",
    "source_ecu": "API_Gateway",
    "destination_ecu": "Door_ECU",
    "payload": "0200000000000000",
    "timestamp": "2026-06-03T00:45:30.123456"
  },
  "transaction_id": "TXN-VEH-12345"
}
```

---

## CAN Frame Structure

All frames follow standard CAN 2.0A format:

**Frame Components:**
- **Arbitration ID:** 11-bit identifier (0x000 - 0x7FF)
- **Data Length:** 8 bytes (DLC = 8)
- **Data:** Command byte + parameters (7 bytes)
- **Extended ID:** False (standard 11-bit)

**Example - Door Unlock (0x321):**
```
Byte 0: 0x02 (Unlock command)
Byte 1-7: 0x00 (Padding/reserved)
```

**Example - GPS Locate (0x500):**
```
Byte 0: 0x47 ('G')
Byte 1: 0x50 ('P')
Byte 2: 0x53 ('S')
Byte 3-7: 0x00 (Padding)
```

---

## WebSocket Events

CAN frames are broadcast via Socket.IO:

**Event:** `can_frame`

**Payload:**
```json
{
  "can_id": "0x321",
  "source_ecu": "API_Gateway",
  "destination_ecu": "Door_ECU",
  "payload": "0200000000000000",
  "timestamp": "2026-06-03T00:45:30.123456",
  "transaction_id": "TXN-VEH-12345"
}
```

---

## Troubleshooting

### Issue: "python-can not available"
**Solution:** Install python-can
```bash
pip install python-can
```

### Issue: "Could not initialize CAN interface vcan0"
**Solution:** Create vcan0 interface
```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

### Issue: "No frames appearing in candump"
**Solution:** Verify vcan0 is up
```bash
ip link show vcan0
# Should show: UP,LOWER_UP
```

### Issue: "Permission denied on vcan0"
**Solution:** Run with sudo or add user to appropriate group
```bash
sudo usermod -a -G dialout $USER
```

---

## Summary

✅ **Real CAN Integration Complete**  
✅ **CAN IDs Updated to Specification**  
✅ **All Vehicle Commands Generate Real Frames**  
✅ **Infotainment Commands Generate Real Frames**  
✅ **Attack Simulations Generate Real Frames**  
✅ **CAN Monitor Displays Real Traffic**  
✅ **Observable with candump vcan0**  
✅ **Platform Detection (Linux/Windows)**  
✅ **Simulation Fallback for Development**

AutoAPI-X is now a **real connected vehicle simulation platform** that generates actual SocketCAN traffic on vcan0, observable with Linux CAN tools.

All dashboard actions, infotainment controls, and attack simulations now produce real CAN frames that can be monitored, captured, and analyzed using standard automotive CAN tools.

**Implementation Complete.** ✅
