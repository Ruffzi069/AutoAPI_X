# Test cansend Commands - Quick Guide

## 🎯 Answer to Your Question

**Q:** Why doesn't `cansend vcan0 322#0100000000000000` work?  
**A:** AutoAPI-X was only **sending** CAN frames, not **receiving** them.

**Fix:** Added CAN listener that processes incoming frames and updates UI.

---

## 🚀 How to Test

### Step 1: Start Backend
```bash
cd backend
python run_production.py
```

**Look for:**
```
✓ CAN interface 'vcan0' initialized successfully
✓ CAN listener enabled - will process incoming frames from vcan0
```

---

### Step 2: Test Door Unlock
```bash
cansend vcan0 321#0200000000000000
```

**Backend should show:**
```
✓ CAN Frame Received: ID=0x321 Data=0200000000000000
  → Doors: UNLOCKED
```

**Frontend UI should show:**
- Dashboard: Doors → Unlocked
- Digital twin updates

---

### Step 3: Test Lights Flash
```bash
cansend vcan0 322#0100000000000000
```

**Backend should show:**
```
✓ CAN Frame Received: ID=0x322 Data=0100000000000000
  → Lights: FLASHING
```

**After 3 seconds:**
- Lights automatically turn off
- UI updates

---

### Step 4: Test Engine Start
```bash
cansend vcan0 400#0100000000000000
```

**Backend should show:**
```
✓ CAN Frame Received: ID=0x400 Data=0100000000000000
  → Engine: RUNNING
```

**Frontend UI should show:**
- Dashboard: Engine → Running

---

## 📋 All Test Commands

### Doors
```bash
# Unlock
cansend vcan0 321#0200000000000000

# Lock
cansend vcan0 321#0100000000000000
```

### Lights
```bash
# Flash
cansend vcan0 322#0100000000000000

# Off
cansend vcan0 322#0000000000000000
```

### Horn
```bash
cansend vcan0 320#0100000000000000
```

### Boot
```bash
# Open
cansend vcan0 330#0100000000000000

# Close
cansend vcan0 330#0000000000000000
```

### Engine
```bash
# Start
cansend vcan0 400#0100000000000000

# Stop
cansend vcan0 400#0000000000000000
```

### GPS
```bash
# Locate (GPS in ASCII = 0x47 0x50 0x53)
cansend vcan0 500#4750530000000000
```

---

## ✅ Success Indicators

For each `cansend` command you should see:

1. **Backend Console:**
   ```
   ✓ CAN Frame Received: ID=0xXXX Data=...
     → [Component]: [State]
   ```

2. **Frontend UI:**
   - Dashboard updates immediately
   - No page refresh needed
   - State matches command

3. **Database:**
   ```sql
   SELECT doors_status, engine_status, lights_status 
   FROM vehicles;
   ```
   - Values match commands sent

---

## 🚨 If It Doesn't Work

### Check 1: Is listener enabled?

**Look for this in backend startup:**
```
✓ CAN listener enabled - will process incoming frames from vcan0
```

**If you see:**
```
⚠ CAN listener not available in simulation mode
```

**Problem:** You're on Windows or vcan0 isn't available  
**Solution:** Deploy to Linux and setup vcan0

---

### Check 2: Is vcan0 up?
```bash
ip link show vcan0
```

**Should show:**
```
vcan0: <NOARP,UP,LOWER_UP> ...
```

**If down:**
```bash
sudo ip link set up vcan0
```

---

### Check 3: Is backend receiving frames?

**Open candump in parallel:**
```bash
candump vcan0
```

**Send command:**
```bash
cansend vcan0 321#0200000000000000
```

**candump should show:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00
```

**If candump shows the frame but backend doesn't:**
- Check backend logs for errors
- Restart backend
- Verify CAN listener started

---

## 🔬 Advanced Testing

### Test Bidirectional Flow

**Terminal 1: Backend (running)**  
**Terminal 2: candump vcan0 (monitoring)**  
**Terminal 3: cansend (sending external commands)**  
**Terminal 4: Frontend UI (user clicking buttons)**

**Action Sequence:**
1. User clicks "Unlock" in UI
2. candump shows: `vcan0  321   [8]  02 00 00 00 00 00 00 00`
3. Backend logs: "CAN Frame Sent"
4. Send `cansend vcan0 321#0100000000000000`
5. candump shows: `vcan0  321   [8]  01 00 00 00 00 00 00 00`
6. Backend logs: "CAN Frame Received"
7. UI updates: Doors → Locked

**Result:** Both API and external CAN commands work!

---

### Test Replay Attack

**Step 1: Capture traffic**
```bash
candump -l vcan0
```

**Step 2: Perform actions**
- Unlock vehicle
- Flash lights
- Start engine

**Step 3: Stop capture (Ctrl+C)**

**Step 4: Lock vehicle** (via UI or cansend)

**Step 5: Replay captured traffic**
```bash
canplayer -I candump-*.log vcan0
```

**Result:**
- Doors unlock again (replay successful!)
- Lights flash again
- Engine starts again
- This demonstrates replay attack vulnerability

---

## 🎯 Quick Validation Script

Create `test_cansend.sh`:
```bash
#!/bin/bash

echo "Testing CAN commands..."

echo "1. Unlock doors..."
cansend vcan0 321#0200000000000000
sleep 2

echo "2. Flash lights..."
cansend vcan0 322#0100000000000000
sleep 3

echo "3. Start engine..."
cansend vcan0 400#0100000000000000
sleep 2

echo "4. Horn..."
cansend vcan0 320#0100000000000000
sleep 2

echo "5. Open boot..."
cansend vcan0 330#0100000000000000
sleep 2

echo "6. GPS locate..."
cansend vcan0 500#4750530000000000
sleep 5

echo "Done! Check backend logs and UI."
```

**Run:**
```bash
chmod +x test_cansend.sh
./test_cansend.sh
```

**Watch:**
- Backend console for log messages
- Frontend UI for state changes
- Everything should update automatically

---

## ✅ Expected Results

### Before Fix
```bash
$ cansend vcan0 322#0100000000000000
$ # Nothing happens in UI
$ # Backend doesn't log anything
$ # Database unchanged
```

### After Fix
```bash
$ cansend vcan0 322#0100000000000000

# Backend shows:
✓ CAN Frame Received: ID=0x322 Data=0100000000000000
  → Lights: FLASHING

# UI updates:
Dashboard: Lights → Flashing

# Database updated:
lights_status = 'flashing'

# After 3 seconds:
  → Lights: OFF
Dashboard: Lights → Off
lights_status = 'off'
```

---

## 🎉 Success!

When `cansend` commands update the UI, you have:
- ✅ Bidirectional CAN communication
- ✅ External CAN tools working
- ✅ Realistic connected vehicle simulation
- ✅ Replay attack capabilities (educational)
- ✅ Full SocketCAN integration

---

**Files Modified:**
- `backend/can_manager/socketcan_manager.py` - Added `start_listening()`
- `backend/services/can_listener_service.py` - NEW - Frame processor
- `backend/app.py` - Initialize CAN listener

**Test Now:**
```bash
cansend vcan0 322#0100000000000000
```

**Should work! 🎉**
