# CAN Listener Feature - Bidirectional CAN Communication

## 🎯 Feature Overview

AutoAPI-X now supports **bidirectional CAN communication** - it can both **send** and **receive** CAN frames on vcan0.

### Before (Transmit-Only)
```
Frontend → API → Backend → vcan0
```

### After (Bidirectional)
```
Frontend ←→ API ←→ Backend ←→ vcan0
                               ↑
                          cansend, external tools
```

---

## 🚀 What's New

### CAN Frame Listener
- **Background thread** monitors vcan0 for incoming CAN frames
- **Automatic processing** of received frames
- **Vehicle state updates** based on CAN commands
- **Real-time UI synchronization** via SocketIO

### Supported Use Cases

1. **External CAN Tools**
   ```bash
   cansend vcan0 321#0200000000000000  # Unlock doors
   cansend vcan0 322#0100000000000000  # Flash lights
   cansend vcan0 400#0100000000000000  # Start engine
   ```

2. **CAN Replay Attacks**
   ```bash
   candump -l vcan0           # Capture traffic
   canplayer candump.log      # Replay captured frames
   ```

3. **CAN Fuzzing**
   ```bash
   # Send random frames and observe vehicle behavior
   cansend vcan0 321#$(openssl rand -hex 8)
   ```

4. **Integration with CAN Analysis Tools**
   - CANalyzer
   - Wireshark with SocketCAN
   - python-can scripts
   - Custom CAN tools

---

## 📊 Architecture

### Components

#### 1. SocketCANManager (Enhanced)
**File:** `backend/can_manager/socketcan_manager.py`

**New Method:**
```python
def start_listening(self, callback):
    """
    Start listening for incoming CAN frames
    Runs in background thread
    Calls callback(can_id, data, timestamp) for each frame
    """
```

#### 2. CANListenerService (New)
**File:** `backend/services/can_listener_service.py`

**Purpose:** Process incoming CAN frames and update vehicle state

**Key Method:**
```python
def process_frame(self, can_id, data, timestamp):
    """
    - Parses CAN frame
    - Identifies command
    - Updates database
    - Emits SocketIO update
    """
```

#### 3. App Initialization (Enhanced)
**File:** `backend/app.py`

**New Code:**
```python
can_manager = SocketCANManager()
can_listener_service = CANListenerService(socketio)
can_manager.start_listening(can_listener_service.process_frame)
```

---

## 🔍 How It Works

### Example: External Door Unlock

**Step 1: Send CAN Frame**
```bash
$ cansend vcan0 321#0200000000000000
```

**Step 2: Backend Receives Frame**
```
✓ CAN Frame Received: ID=0x321 Data=0200000000000000
```

**Step 3: Frame Processing**
```python
can_id = 0x321  # Door ECU
payload = [0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
# 0x02 = unlock command
```

**Step 4: Vehicle State Update**
```sql
UPDATE vehicles SET doors_status = 'unlocked'
```

**Step 5: Console Output**
```
  → Doors: UNLOCKED
```

**Step 6: SocketIO Emission**
```javascript
socketio.emit('vehicle_updates', {
  vin: '5YJ3E1EA1KF000001',
  doors_status: 'unlocked',
  ...
})
```

**Step 7: Frontend Update**
- Dashboard shows "Doors: Unlocked"
- Digital twin updates visually
- No page refresh needed

---

## 🧪 Testing

### Test 1: Door Lock/Unlock
```bash
# Unlock
cansend vcan0 321#0200000000000000

# Lock
cansend vcan0 321#0100000000000000
```

**Expected:**
- Backend logs: "→ Doors: UNLOCKED" / "→ Doors: LOCKED"
- UI updates automatically
- Database reflects change

### Test 2: Lights Flash
```bash
cansend vcan0 322#0100000000000000
```

**Expected:**
- Backend logs: "→ Lights: FLASHING"
- UI shows lights flashing
- After 3 seconds: Lights turn off automatically

### Test 3: Engine Start/Stop
```bash
# Start
cansend vcan0 400#0100000000000000

# Stop
cansend vcan0 400#0000000000000000
```

**Expected:**
- Backend logs: "→ Engine: RUNNING" / "→ Engine: OFF"
- UI updates engine status

### Test 4: Horn
```bash
cansend vcan0 320#0100000000000000
```

**Expected:**
- Backend logs: "→ Horn: ACTIVE"
- UI shows horn active
- After 2 seconds: Horn resets automatically

### Test 5: Boot Open/Close
```bash
# Open
cansend vcan0 330#0100000000000000

# Close
cansend vcan0 330#0000000000000000
```

**Expected:**
- Backend logs: "→ Boot: OPEN" / "→ Boot: CLOSED"
- UI updates boot status

### Test 6: GPS Locate
```bash
# "GPS" in ASCII = 0x47 0x50 0x53
cansend vcan0 500#4750530000000000
```

**Expected:**
- Backend logs: "→ GPS: TRACKING"
- UI shows GPS tracking
- After 5 seconds: GPS returns to active

---

## 📋 CAN Command Reference

| Function | CAN ID | Payload | Example |
|----------|--------|---------|---------|
| Unlock Doors | 0x321 | `02 00 00 00 00 00 00 00` | `cansend vcan0 321#0200000000000000` |
| Lock Doors | 0x321 | `01 00 00 00 00 00 00 00` | `cansend vcan0 321#0100000000000000` |
| Flash Lights | 0x322 | `01 00 00 00 00 00 00 00` | `cansend vcan0 322#0100000000000000` |
| Lights Off | 0x322 | `00 00 00 00 00 00 00 00` | `cansend vcan0 322#0000000000000000` |
| Horn | 0x320 | `01 00 00 00 00 00 00 00` | `cansend vcan0 320#0100000000000000` |
| Open Boot | 0x330 | `01 00 00 00 00 00 00 00` | `cansend vcan0 330#0100000000000000` |
| Close Boot | 0x330 | `00 00 00 00 00 00 00 00` | `cansend vcan0 330#0000000000000000` |
| Start Engine | 0x400 | `01 00 00 00 00 00 00 00` | `cansend vcan0 400#0100000000000000` |
| Stop Engine | 0x400 | `00 00 00 00 00 00 00 00` | `cansend vcan0 400#0000000000000000` |
| GPS Locate | 0x500 | `47 50 53 00 00 00 00 00` | `cansend vcan0 500#4750530000000000` |

---

## 🔬 Advanced Use Cases

### Replay Attack Simulation

**Step 1: Capture legitimate traffic**
```bash
candump -l vcan0
```

Perform actions in UI (unlock, lock, horn, etc.)

**Step 2: Stop capture (Ctrl+C)**

**Step 3: Replay captured traffic**
```bash
canplayer -I candump-2026-06-03_220821.log vcan0
```

**Result:** Vehicle responds to replayed frames as if they were new commands.

---

### CAN Fuzzing

**Generate random door commands:**
```bash
for i in {1..100}; do
  cansend vcan0 321#$(openssl rand -hex 8)
  sleep 0.1
done
```

**Observe:**
- Backend processing each frame
- Valid commands update vehicle state
- Invalid payloads are ignored or logged

---

### Multi-Source CAN Traffic

**Terminal 1: AutoAPI-X Backend**
```bash
python run_production.py
```

**Terminal 2: candump (monitor)**
```bash
candump vcan0
```

**Terminal 3: cansend (external commands)**
```bash
cansend vcan0 321#0200000000000000
```

**Terminal 4: Frontend UI**
- User clicks "Lock" button

**Result:**
- Both sources (UI and cansend) work
- Both produce visible results
- candump shows all traffic
- Backend processes all frames

---

## 🚨 Security Implications

### Attack Surface Increased

**Before:** Only authenticated API requests could control vehicle  
**After:** Any CAN frame on vcan0 can control vehicle

**Realistic Scenario:** This mirrors real-world connected vehicles where:
- API Gateway is one control path
- Physical CAN bus is another control path
- Attackers with CAN access can bypass API authentication

### Educational Value

This demonstrates:
- **CAN bus vulnerability:** No authentication at CAN layer
- **Replay attacks:** Captured frames can be replayed
- **Injection attacks:** Arbitrary frames can be injected
- **Spoofing:** Frames appear legitimate even if malicious

---

## 🛡️ Mitigation Strategies (Future)

### 1. CAN Frame Validation
```python
def validate_frame(can_id, data, source):
    """
    - Check frame sequence numbers
    - Validate cryptographic signatures
    - Verify source authentication
    - Rate limiting per command
    """
```

### 2. CAN Intrusion Detection
```python
def detect_anomaly(can_id, data, frequency):
    """
    - Monitor frame frequency
    - Detect repeated frames (replay attack)
    - Alert on suspicious patterns
    - Block malicious sources
    """
```

### 3. Secure CAN (Future Standard)
- Message Authentication Codes (MAC)
- Encrypted payloads
- Sequence numbers
- Freshness timestamps

---

## 📊 Console Output Examples

### Normal Operation
```
✓ CAN interface 'vcan0' initialized successfully
✓ CAN listener enabled - will process incoming frames from vcan0

✓ CAN Frame Received: ID=0x321 Data=0200000000000000
  → Doors: UNLOCKED

✓ CAN Frame Received: ID=0x322 Data=0100000000000000
  → Lights: FLASHING

✓ CAN Frame Received: ID=0x400 Data=0100000000000000
  → Engine: RUNNING
```

### Windows (Simulation Mode)
```
✓ Running on Windows - CAN simulation mode enabled
⚠ CAN listener not available in simulation mode
```

**Note:** Listener only works on Linux with vcan0.

---

## ✅ Verification

### Test Complete Bidirectional Flow

**Terminal 1: Backend**
```bash
python run_production.py
```

**Terminal 2: candump**
```bash
candump vcan0
```

**Terminal 3: Test**
```bash
# Send unlock via cansend
cansend vcan0 321#0200000000000000
```

**Expected Results:**

**candump shows:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00
```

**Backend shows:**
```
✓ CAN Frame Received: ID=0x321 Data=0200000000000000
  → Doors: UNLOCKED
```

**Frontend UI shows:**
- Doors: Unlocked
- No API request in API Monitor
- CAN frame appears in CAN Monitor (future enhancement)

**Database shows:**
```sql
SELECT doors_status FROM vehicles;
-- Result: 'unlocked'
```

✅ **SUCCESS:** External CAN command updated vehicle state and UI!

---

## 🎯 Summary

### What Was Added
- ✅ CAN frame listener (background thread)
- ✅ Frame processing service (interprets commands)
- ✅ Vehicle state updates from CAN frames
- ✅ Real-time UI synchronization
- ✅ Support for external CAN tools

### What Works Now
- ✅ `cansend` commands update vehicle state
- ✅ Replay attacks are possible (educational)
- ✅ CAN fuzzing works
- ✅ External tools can control vehicle
- ✅ Bidirectional CAN communication

### Platform Behavior
- **Linux:** Full bidirectional CAN (send + receive)
- **Windows:** Transmit-only simulation (no listening)

---

**Status:** ✅ IMPLEMENTED  
**Tested:** ⏳ Ready for Linux testing  
**Impact:** Enables realistic connected vehicle simulation with external CAN tools  
**Security Note:** Demonstrates real-world CAN vulnerabilities for educational purposes
