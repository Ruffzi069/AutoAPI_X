# Attack ID Mapping Reference

## Complete Attack ID Synchronization Map

### Attack #1: Replay Attack
```
Frontend ID:  'replay'
Backend Route: /api/attacks/replay
Backend Method: simulate_replay_attack()
attackStore ID: 'replay' ✅
CAN ID: 0x321 (Door Control ECU)
Frames: 5 repeated unlock commands
```

### Attack #2: IDOR
```
Frontend ID:  'idor'
Backend Route: /api/attacks/idor
Backend Method: simulate_idor_attack()
attackStore ID: 'idor' ✅
CAN IDs: 0x321 (Door), 0x500 (GPS), 0x330 (Boot)
Frames: 3 unauthorized access commands
```

### Attack #3: Broken Authentication
```
Frontend ID:  'broken-authentication'
Backend Route: /api/attacks/broken-authentication
Backend Method: simulate_broken_authentication_attack()
attackStore ID: 'broken-authentication' ✅ (FIXED from 'broken-auth')
CAN IDs: 0x321 (Door), 0x320 (Horn), 0x322 (Lights), 0x400 (Ignition)
Frames: 4 unauthorized control commands
```

### Attack #4: Excessive Data Exposure
```
Frontend ID:  'excessive-data-exposure'
Backend Route: /api/attacks/excessive-data-exposure
Backend Method: simulate_excessive_data_exposure_attack()
attackStore ID: 'excessive-data-exposure' ✅ (FIXED from 'data-exposure')
CAN ID: 0x500 (GPS ECU)
Frames: 5 GPS telemetry queries
```

### Attack #5: Rate Limiting Failure
```
Frontend ID:  'rate-limiting-failure'
Backend Route: /api/attacks/rate-limiting-failure
Backend Method: simulate_rate_limiting_failure_attack()
attackStore ID: 'rate-limiting-failure' ✅ (FIXED from 'rate-limiting')
CAN IDs: 0x321, 0x320, 0x322, 0x500, 0x330 (Multiple ECUs)
Frames: 30+ burst frames
```

### Attack #6: OTA Manipulation
```
Frontend ID:  'ota-manipulation'
Backend Route: /api/attacks/ota-manipulation
Backend Method: simulate_ota_manipulation_attack()
attackStore ID: 'ota-manipulation' ✅
CAN IDs: 0x700 (OTA ECU), 0x600 (Infotainment ECU)
Frames: 5 firmware manipulation sequence
```

## Before/After Comparison

### BEFORE FIX ❌

```
User clicks "Replay Attack"
  ↓
AttackSimulation.tsx sends: attackId = 'replay'
  ↓
Backend executes: /api/attacks/replay ✅
  ↓
Frontend calls: addExecution('replay', txnId, timeline)
  ↓
attackStore looks up: attackImpactProfiles['replay']
  ↓
Result: undefined ❌ (because key was 'replay-attack')
  ↓
Impact Analysis: No data to display ❌
```

### AFTER FIX ✅

```
User clicks "Replay Attack"
  ↓
AttackSimulation.tsx sends: attackId = 'replay'
  ↓
Backend executes: /api/attacks/replay ✅
  ↓
Frontend calls: addExecution('replay', txnId, timeline)
  ↓
attackStore looks up: attackImpactProfiles['replay']
  ↓
Result: Complete attack execution data ✅
  ↓
Impact Analysis: Displays full metrics ✅
```

## CAN Traffic Reference

### Replay Attack CAN Pattern
```bash
# candump vcan0 output:
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock #1
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock #2 (200ms later)
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock #3 (200ms later)
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock #4 (200ms later)
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock #5 (200ms later)
```

### IDOR CAN Pattern
```bash
# candump vcan0 output:
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unauthorized unlock
vcan0  500   [8]  47 50 53 01 00 00 00 00  # GPS access
vcan0  330   [8]  03 00 00 00 00 00 00 00  # Boot open
```

### Broken Authentication CAN Pattern
```bash
# candump vcan0 output:
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock (no auth)
vcan0  320   [8]  01 00 00 00 00 00 00 00  # Horn activate
vcan0  322   [8]  01 00 00 00 00 00 00 00  # Lights flash
vcan0  400   [8]  01 00 00 00 00 00 00 00  # Engine start
```

### Excessive Data Exposure CAN Pattern
```bash
# candump vcan0 output:
vcan0  500   [8]  47 50 53 01 00 00 00 00  # GPS query #1
vcan0  500   [8]  47 50 53 01 00 00 00 00  # GPS query #2
vcan0  500   [8]  47 50 53 01 00 00 00 00  # GPS query #3
vcan0  500   [8]  47 50 53 01 00 00 00 00  # GPS query #4
vcan0  500   [8]  47 50 53 01 00 00 00 00  # GPS query #5
```

### Rate Limiting Failure CAN Pattern
```bash
# candump vcan0 output (high-frequency burst):
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock (50ms)
vcan0  321   [8]  01 00 00 00 00 00 00 00  # Lock (50ms)
vcan0  320   [8]  01 00 00 00 00 00 00 00  # Horn (50ms)
vcan0  322   [8]  01 00 00 00 00 00 00 00  # Lights (50ms)
vcan0  500   [8]  47 50 53 01 00 00 00 00  # GPS (50ms)
vcan0  330   [8]  03 00 00 00 00 00 00 00  # Boot (50ms)
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock (50ms)
... (continues for 30+ frames)
```

### OTA Manipulation CAN Pattern
```bash
# candump vcan0 output:
vcan0  700   [8]  01 00 00 00 00 00 00 00  # Firmware check
vcan0  700   [8]  02 00 00 00 00 00 00 00  # Download stage 1
vcan0  700   [8]  03 00 00 00 00 00 00 00  # Download stage 2
vcan0  700   [8]  04 00 00 00 00 00 00 00  # Install malicious firmware
vcan0  600   [8]  01 00 00 00 00 00 00 00  # Infotainment compromised
```

## API Endpoints

All endpoints accept POST requests with JSON body:

```bash
# Replay Attack
curl -X POST http://localhost:5000/api/attacks/replay \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001","iterations":5}'

# IDOR
curl -X POST http://localhost:5000/api/attacks/idor \
  -H "Content-Type: application/json" \
  -d '{"victim_vin":"5YJ3E1EA1KF000001","attacker_vin":"ATTACKER"}'

# Broken Authentication
curl -X POST http://localhost:5000/api/attacks/broken-authentication \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001"}'

# Excessive Data Exposure
curl -X POST http://localhost:5000/api/attacks/excessive-data-exposure \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001"}'

# Rate Limiting Failure
curl -X POST http://localhost:5000/api/attacks/rate-limiting-failure \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001","burst_count":30}'

# OTA Manipulation
curl -X POST http://localhost:5000/api/attacks/ota-manipulation \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001"}'
```

## Transaction ID Format

All attacks generate transaction IDs in the format:
```
TXN-ATT-XXXXX
```

Example: `TXN-ATT-42891`

These IDs flow through:
1. Backend generation (TelemetryService)
2. API response
3. Frontend attack panels
4. attackStore execution records
5. Impact Analysis displays

## Files That Use Attack IDs

### Frontend
- ✅ `frontend/src/pages/AttackSimulation.tsx` - Attack definitions
- ✅ `frontend/src/stores/attackStore.ts` - Impact profiles (FIXED)
- ✅ `frontend/src/components/AttackSimulation/APIActivityPanel.tsx`
- ✅ `frontend/src/components/AttackSimulation/CANActivityPanel.tsx`
- ✅ `frontend/src/components/AttackSimulation/VehicleReactionPanel.tsx`
- ✅ `frontend/src/config/api.ts` - Endpoint mappings

### Backend
- ✅ `backend/routes/attack_routes.py` - Route definitions
- ✅ `backend/services/attack_simulation_service.py` - Implementation

## Quick Reference Table

| Attack | ID | Backend Route | CAN IDs | Frame Count |
|--------|----|--------------|---------| ------------|
| Replay | `replay` | `/api/attacks/replay` | 0x321 | 5 |
| IDOR | `idor` | `/api/attacks/idor` | 0x321, 0x500, 0x330 | 3 |
| Broken Auth | `broken-authentication` | `/api/attacks/broken-authentication` | 0x321, 0x320, 0x322, 0x400 | 4 |
| Data Exposure | `excessive-data-exposure` | `/api/attacks/excessive-data-exposure` | 0x500 | 5 |
| Rate Limiting | `rate-limiting-failure` | `/api/attacks/rate-limiting-failure` | Multiple | 30+ |
| OTA | `ota-manipulation` | `/api/attacks/ota-manipulation` | 0x700, 0x600 | 5 |

---

**Use this document as the single source of truth for attack IDs!** 🎯
