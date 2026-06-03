# Attack Simulation Guide - Real CAN Traffic Generation

## 🎯 Overview

AutoAPI-X now generates **real CAN traffic** during attack simulations that is observable with `candump vcan0`.

Every attack produces:
- ✅ API activity (logged in API Monitor)
- ✅ CAN traffic (transmitted to vcan0)
- ✅ Vehicle state updates (database)
- ✅ Real-time UI updates (SocketIO)
- ✅ Observable frames (candump vcan0)
- ✅ Impact analysis data

---

## 🚀 Quick Start

### Terminal Setup

**Terminal 1: Backend**
```bash
python run_production.py
```

**Terminal 2: CAN Monitor**
```bash
candump vcan0
```

**Terminal 3: Attack Execution**
```bash
# Use curl or frontend UI
```

---

## 📊 Attack Types

### 1. Replay Attack

**Purpose:** Re-send captured vehicle commands

**CAN Pattern:** Repeated identical frames
```
vcan0  321   [8]  02 00 00 00 00 00 00 00
vcan0  321   [8]  02 00 00 00 00 00 00 00
vcan0  321   [8]  02 00 00 00 00 00 00 00
vcan0  321   [8]  02 00 00 00 00 00 00 00
vcan0  321   [8]  02 00 00 00 00 00 00 00
```

**Timing:** 200ms gaps between frames

**Execute:**
```bash
curl -X POST http://localhost:5000/api/attacks/replay \
  -H "Content-Type: application/json" \
  -d '{"vin": "5YJ3E1EA1KF000001", "iterations": 5}'
```

**Expected candump Output:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock
(200ms gap)
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock
(200ms gap)
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock
(200ms gap)
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock
(200ms gap)
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock
```

**Backend Console:**
```
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
```

**Vehicle Effect:** Repeated unlock attempts

---

### 2. IDOR Attack

**Purpose:** Unauthorized access to another vehicle's resources

**CAN Pattern:** Unlock → GPS → Boot
```
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unauthorized unlock
vcan0  500   [8]  47 50 53 00 00 00 00 00  # Unauthorized GPS
vcan0  330   [8]  01 00 00 00 00 00 00 00  # Unauthorized boot
```

**Timing:** 100ms, 200ms gaps

**Execute:**
```bash
curl -X POST http://localhost:5000/api/attacks/idor \
  -H "Content-Type: application/json" \
  -d '{
    "victim_vin": "5YJ3E1EA1KF000001",
    "attacker_vin": "ATTACKER_VIN"
  }'
```

**Expected candump Output:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock
(100ms gap)
vcan0  500   [8]  47 50 53 00 00 00 00 00  # GPS ("GPS" in ASCII)
(200ms gap)
vcan0  330   [8]  01 00 00 00 00 00 00 00  # Boot open
```

**Backend Console:**
```
⚠ ATTACK_STARTED: IDOR Attack: Attacker ATTACKER_VIN targeting 5YJ3E1EA1KF000001
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
⚠ IDOR_ATTACK: Unauthorized door unlock on 5YJ3E1EA1KF000001
✓ CAN Frame Sent: ID=0x500 Data=4750530000000000 (API_Gateway → GPS_ECU)
⚠ IDOR_ATTACK: Unauthorized GPS access on 5YJ3E1EA1KF000001
✓ CAN Frame Sent: ID=0x330 Data=0100000000000000 (API_Gateway → Boot_ECU)
⚠ IDOR_ATTACK: Unauthorized boot access on 5YJ3E1EA1KF000001
⚠ ATTACK_COMPLETED: IDOR Attack completed - 3 unauthorized commands executed
```

**Vehicle Effect:** Door unlock, GPS access, boot open

---

### 3. Broken Authentication Attack

**Purpose:** Execute commands without proper authentication

**CAN Pattern:** Unlock → Horn → Lights → Engine
```
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock
vcan0  320   [8]  01 00 00 00 00 00 00 00  # Horn
vcan0  322   [8]  01 00 00 00 00 00 00 00  # Lights
vcan0  400   [8]  01 00 00 00 00 00 00 00  # Engine
```

**Timing:** 150ms gaps

**Execute:**
```bash
curl -X POST http://localhost:5000/api/attacks/broken-authentication \
  -H "Content-Type: application/json" \
  -d '{"vin": "5YJ3E1EA1KF000001"}'
```

**Expected candump Output:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock (no auth)
(150ms gap)
vcan0  320   [8]  01 00 00 00 00 00 00 00  # Horn (no auth)
(150ms gap)
vcan0  322   [8]  01 00 00 00 00 00 00 00  # Lights (no auth)
(150ms gap)
vcan0  400   [8]  01 00 00 00 00 00 00 00  # Engine (no auth)
```

**Backend Console:**
```
⚠ ATTACK_STARTED: Broken Authentication Attack on 5YJ3E1EA1KF000001
⚠ BROKEN_AUTH_ATTACK: Executing door unlock without authentication
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000
⚠ BROKEN_AUTH_ATTACK: Activating horn without authentication
✓ CAN Frame Sent: ID=0x320 Data=0100000000000000
⚠ BROKEN_AUTH_ATTACK: Flashing lights without authentication
✓ CAN Frame Sent: ID=0x322 Data=0100000000000000
⚠ BROKEN_AUTH_ATTACK: Starting engine without authentication
✓ CAN Frame Sent: ID=0x400 Data=0100000000000000
⚠ ATTACK_COMPLETED: Broken Authentication Attack completed
```

**Vehicle Effect:** Full vehicle control without authentication

---

### 4. Excessive Data Exposure Attack

**Purpose:** Access sensitive vehicle telemetry

**CAN Pattern:** GPS queries (no physical control)
```
vcan0  500   [8]  47 50 53 00 00 00 00 00  # GPS locate
vcan0  500   [8]  01 00 00 00 00 00 00 00  # GPS activate
vcan0  500   [8]  47 50 53 00 00 00 00 00  # Telemetry query
vcan0  500   [8]  47 50 53 00 00 00 00 00  # Telemetry query
vcan0  500   [8]  47 50 53 00 00 00 00 00  # Telemetry query
```

**Timing:** 200ms gaps, then 100ms bursts

**Execute:**
```bash
curl -X POST http://localhost:5000/api/attacks/excessive-data-exposure \
  -H "Content-Type: application/json" \
  -d '{"vin": "5YJ3E1EA1KF000001"}'
```

**Expected candump Output:**
```
vcan0  500   [8]  47 50 53 00 00 00 00 00  # GPS
(200ms)
vcan0  500   [8]  01 00 00 00 00 00 00 00  # Status
(200ms)
vcan0  500   [8]  47 50 53 00 00 00 00 00  # Telemetry
(100ms)
vcan0  500   [8]  47 50 53 00 00 00 00 00  # Telemetry
(100ms)
vcan0  500   [8]  47 50 53 00 00 00 00 00  # Telemetry
```

**Backend Console:**
```
⚠ ATTACK_STARTED: Excessive Data Exposure Attack on 5YJ3E1EA1KF000001
⚠ DATA_EXPOSURE_ATTACK: Accessing GPS location data
✓ CAN Frame Sent: ID=0x500 Data=4750530000000000
⚠ DATA_EXPOSURE_ATTACK: Accessing vehicle status data
✓ CAN Frame Sent: ID=0x500 Data=0100000000000000
⚠ DATA_EXPOSURE_ATTACK: Accessing vehicle telemetry
✓ CAN Frame Sent: ID=0x500 Data=4750530000000000 (x3)
⚠ ATTACK_COMPLETED: Excessive Data Exposure completed
```

**Vehicle Effect:** No physical control, privacy compromise

---

### 5. Rate Limiting Failure Attack

**Purpose:** Flood vehicle APIs

**CAN Pattern:** High-frequency burst on multiple ECUs
```
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock
vcan0  321   [8]  01 00 00 00 00 00 00 00  # Lock
vcan0  320   [8]  01 00 00 00 00 00 00 00  # Horn
vcan0  322   [8]  01 00 00 00 00 00 00 00  # Lights
vcan0  500   [8]  47 50 53 00 00 00 00 00  # GPS
vcan0  330   [8]  01 00 00 00 00 00 00 00  # Boot
... (30 frames total, cycling through commands)
```

**Timing:** 50ms for first half, 100ms for second half

**Execute:**
```bash
curl -X POST http://localhost:5000/api/attacks/rate-limiting-failure \
  -H "Content-Type: application/json" \
  -d '{"vin": "5YJ3E1EA1KF000001", "burst_count": 30}'
```

**Expected candump Output:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Fast burst
vcan0  321   [8]  01 00 00 00 00 00 00 00
vcan0  320   [8]  01 00 00 00 00 00 00 00
vcan0  322   [8]  01 00 00 00 00 00 00 00
vcan0  500   [8]  47 50 53 00 00 00 00 00
vcan0  330   [8]  01 00 00 00 00 00 00 00
vcan0  321   [8]  02 00 00 00 00 00 00 00
... (continues for 30 frames)
```

**Backend Console:**
```
⚠ ATTACK_STARTED: Rate Limiting Failure Attack - 30 frame burst
⚠ RATE_LIMIT_ATTACK: Burst frame 1/30: door_unlock
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000
⚠ RATE_LIMIT_ATTACK: Burst frame 2/30: door_lock
✓ CAN Frame Sent: ID=0x321 Data=0100000000000000
... (continues)
⚠ ATTACK_COMPLETED: Rate Limiting Attack completed - 30 frames transmitted
```

**Vehicle Effect:** CAN bus congestion, multiple ECU activity

---

### 6. OTA Manipulation Attack

**Purpose:** Simulate malicious firmware activity

**CAN Pattern:** Staged OTA sequence
```
vcan0  700   [8]  30 00 00 00 00 00 00 00  # OTA check
vcan0  700   [8]  31 00 00 00 00 00 00 00  # OTA download
vcan0  700   [8]  32 00 00 00 00 00 00 00  # OTA install
vcan0  700   [8]  30 00 00 00 00 00 00 00  # OTA verify
vcan0  600   [8]  00 00 00 00 00 00 00 00  # Infotainment offline
```

**Timing:** 300ms, 500ms, 300ms, 200ms gaps

**Execute:**
```bash
curl -X POST http://localhost:5000/api/attacks/ota-manipulation \
  -H "Content-Type: application/json" \
  -d '{"vin": "5YJ3E1EA1KF000001"}'
```

**Expected candump Output:**
```
vcan0  700   [8]  30 00 00 00 00 00 00 00  # Check
(300ms)
vcan0  700   [8]  31 00 00 00 00 00 00 00  # Download
(500ms)
vcan0  700   [8]  32 00 00 00 00 00 00 00  # Install
(300ms)
vcan0  700   [8]  30 00 00 00 00 00 00 00  # Verify
(200ms)
vcan0  600   [8]  00 00 00 00 00 00 00 00  # Offline
```

**Backend Console:**
```
⚠ ATTACK_STARTED: OTA Manipulation Attack on 5YJ3E1EA1KF000001
⚠ OTA_MANIPULATION_ATTACK: Stage 1: Initiating fake OTA check
✓ CAN Frame Sent: ID=0x700 Data=3000000000000000
⚠ OTA_MANIPULATION_ATTACK: Stage 2: Downloading malicious firmware
✓ CAN Frame Sent: ID=0x700 Data=3100000000000000
⚠ OTA_MANIPULATION_ATTACK: Stage 3: Installing compromised firmware
✓ CAN Frame Sent: ID=0x700 Data=3200000000000000
⚠ OTA_MANIPULATION_ATTACK: Stage 4: Firmware verification (bypassed)
✓ CAN Frame Sent: ID=0x700 Data=3000000000000000
⚠ OTA_MANIPULATION_ATTACK: Stage 5: Infotainment system compromised
✓ CAN Frame Sent: ID=0x600 Data=0000000000000000
⚠ ATTACK_COMPLETED: OTA Manipulation completed - firmware compromised
```

**Vehicle Effect:** Infotainment compromise, firmware manipulation

---

## 🧪 Testing All Attacks

### Quick Test Script

Create `test_attacks.sh`:
```bash
#!/bin/bash

API="http://localhost:5000/api/attacks"
VIN="5YJ3E1EA1KF000001"

echo "=== Testing All Attack Simulations ==="
echo "Watch candump vcan0 in another terminal!"
echo

echo "1. Replay Attack (5 iterations)..."
curl -s -X POST $API/replay \
  -H "Content-Type: application/json" \
  -d "{\"vin\":\"$VIN\",\"iterations\":5}"
echo
sleep 3

echo "2. IDOR Attack..."
curl -s -X POST $API/idor \
  -H "Content-Type: application/json" \
  -d "{\"victim_vin\":\"$VIN\",\"attacker_vin\":\"ATTACKER\"}"
echo
sleep 3

echo "3. Broken Authentication Attack..."
curl -s -X POST $API/broken-authentication \
  -H "Content-Type: application/json" \
  -d "{\"vin\":\"$VIN\"}"
echo
sleep 3

echo "4. Excessive Data Exposure Attack..."
curl -s -X POST $API/excessive-data-exposure \
  -H "Content-Type: application/json" \
  -d "{\"vin\":\"$VIN\"}"
echo
sleep 3

echo "5. Rate Limiting Failure Attack (30 frames)..."
curl -s -X POST $API/rate-limiting-failure \
  -H "Content-Type: application/json" \
  -d "{\"vin\":\"$VIN\",\"burst_count\":30}"
echo
sleep 5

echo "6. OTA Manipulation Attack..."
curl -s -X POST $API/ota-manipulation \
  -H "Content-Type: application/json" \
  -d "{\"vin\":\"$VIN\"}"
echo

echo
echo "=== All Attacks Executed ==="
echo "Check candump output for CAN traffic!"
```

**Run:**
```bash
chmod +x test_attacks.sh
./test_attacks.sh
```

---

## ✅ Validation Checklist

For each attack:

- [ ] Backend starts without errors
- [ ] Attack endpoint responds with success
- [ ] Backend console shows attack log messages
- [ ] candump shows expected CAN frames
- [ ] CAN IDs match specification
- [ ] Payloads match specification
- [ ] Timing gaps are realistic (not instant)
- [ ] Vehicle state updates in database
- [ ] UI updates in real-time (if open)
- [ ] Attack ID returned for tracking

---

## 📊 Expected CAN Frame Summary

| Attack | Primary CAN IDs | Frame Count | Duration |
|--------|----------------|-------------|----------|
| Replay | 0x321 | 5 (configurable) | ~1 second |
| IDOR | 0x321, 0x500, 0x330 | 3 | ~0.5 seconds |
| Broken Auth | 0x321, 0x320, 0x322, 0x400 | 4 | ~0.6 seconds |
| Data Exposure | 0x500 | 5 | ~0.8 seconds |
| Rate Limiting | 0x321, 0x320, 0x322, 0x500, 0x330 | 30 (configurable) | ~2-4 seconds |
| OTA Manipulation | 0x700, 0x600 | 5 | ~1.5 seconds |

---

## 🎯 Demo Scenario

**For judges/professors:**

**Setup:**
```bash
# Terminal 1
python run_production.py

# Terminal 2
candump vcan0

# Terminal 3 (optional)
candump -ta vcan0  # With timestamps
```

**Demonstration:**
1. Show candump running (no traffic yet)
2. Execute replay attack via UI or curl
3. Point to candump showing repeated frames
4. Explain: "These are actual CAN frames on a virtual bus"
5. Execute OTA manipulation
6. Show staged firmware sequence in candump
7. Execute rate limiting failure
8. Show burst traffic pattern

**Key Points:**
- ✅ Real SocketCAN integration
- ✅ Observable with industry-standard tools
- ✅ Realistic automotive cybersecurity simulation
- ✅ Not just UI animation - actual bus traffic

---

## 🔗 API Reference

### List Available Attacks
```bash
GET /api/attacks/list
```

**Response:**
```json
{
  "success": true,
  "count": 6,
  "attacks": [...]
}
```

### Get Attack Status
```bash
GET /api/attacks/status/{attack_id}
```

**Response:**
```json
{
  "attack_id": "TXN-ABC123",
  "status": "completed"
}
```

---

## 🚨 Troubleshooting

### Attack executes but no CAN traffic in candump

**Check:**
```bash
# 1. Is vcan0 up?
ip link show vcan0

# 2. Is backend in simulation mode?
# Look for: "✓ CAN interface 'vcan0' initialized successfully"
# NOT: "simulation mode enabled"

# 3. Is candump on correct interface?
candump vcan0  # Not vcan1 or other
```

### Frames appear too fast to observe

**Use timestamped candump:**
```bash
candump -ta vcan0
```

**Or log to file:**
```bash
candump -l vcan0
# Then review: candump-*.log
```

---

**Status:** ✅ IMPLEMENTED AND READY FOR TESTING  
**Platform:** Linux with vcan0 (simulation mode on Windows)  
**Observable:** candump vcan0 shows real-time attack traffic  
**Educational Value:** Demonstrates real automotive cybersecurity concepts
