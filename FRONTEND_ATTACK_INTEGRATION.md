# Frontend Attack Integration - Complete Guide

## ✅ Implementation Complete

The frontend Attack Simulation page is now **fully integrated** with the backend API. When you click "Run Attack" in the UI, it triggers real CAN traffic on vcan0.

---

## 🎯 What Was Changed

### 1. API Configuration (`frontend/src/config/api.ts`) - NEW
- Centralized API endpoint configuration
- Helper function `getAttackEndpoint()` to map attack IDs to URLs
- Environment variable support for API URL

### 2. Attack Simulation Page (`frontend/src/pages/AttackSimulation.tsx`) - UPDATED
- **Before:** Simulated attack execution (timeout only)
- **After:** Real API calls to backend

**Key Changes:**
```typescript
// OLD: Fake execution
setTimeout(() => {
  setIsExecuting(false);
}, 4000);

// NEW: Real API call
const response = await fetch(getAttackEndpoint(selectedAttack.id), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ vin: '5YJ3E1EA1KF000001', ... })
});
```

### 3. Attack IDs Synchronized
- Updated attack IDs to match backend endpoints exactly:
  - `replay` (backend) ✅
  - `idor` (backend) ✅
  - `broken-authentication` (backend) ✅
  - `excessive-data-exposure` (backend) ✅
  - `rate-limiting-failure` (backend) ✅
  - `ota-manipulation` (backend) ✅

---

## 🚀 How to Test

### Setup (3 Terminals)

**Terminal 1: Backend**
```bash
cd backend
python run_production.py
```

**Expected output:**
```
✓ CAN interface 'vcan0' initialized successfully
✓ CAN listener enabled - will process incoming frames from vcan0
```

---

**Terminal 2: CAN Monitor**
```bash
candump vcan0
```

**Expected:** Waiting for CAN traffic...

---

**Terminal 3: Frontend**
```bash
cd frontend
npm run dev
```

**Expected:** Frontend running on `http://localhost:5173`

---

### Test Attack Execution

**Step 1:** Open browser to `http://localhost:5173`

**Step 2:** Navigate to **Attack Simulation** page

**Step 3:** Select "Replay Attack"

**Step 4:** Click **"Run Attack"** button

**Expected Results:**

**Browser Console:**
```
✅ Attack executed successfully: {success: true, attack_id: "TXN-...", ...}
🚀 Expected CAN traffic: 5 frames on CAN ID 0x321
📊 Attack ID: TXN-6CBDCCDD
```

**Terminal 2 (candump):**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00
vcan0  321   [8]  02 00 00 00 00 00 00 00
vcan0  321   [8]  02 00 00 00 00 00 00 00
vcan0  321   [8]  02 00 00 00 00 00 00 00
vcan0  321   [8]  02 00 00 00 00 00 00 00
```

**Terminal 1 (Backend):**
```
⚠ ATTACK_STARTED: Replay Attack initiated - 5 iterations
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
⚠ ATTACK_COMPLETED: Replay Attack completed - 5 frames transmitted
```

**Dashboard UI:**
- Vehicle state updates (doors unlocked)
- Real-time SocketIO updates

---

## 🧪 Test All Attacks

### 1. Replay Attack
**Click:** "Run Attack" on Replay Attack

**candump shows:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00 (x5)
```

---

### 2. IDOR
**Click:** "Run Attack" on IDOR

**candump shows:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock
vcan0  500   [8]  47 50 53 00 00 00 00 00  # GPS
vcan0  330   [8]  01 00 00 00 00 00 00 00  # Boot
```

---

### 3. Broken Authentication
**Click:** "Run Attack" on Broken Authentication

**candump shows:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00  # Unlock
vcan0  320   [8]  01 00 00 00 00 00 00 00  # Horn
vcan0  322   [8]  01 00 00 00 00 00 00 00  # Lights
vcan0  400   [8]  01 00 00 00 00 00 00 00  # Engine
```

---

### 4. Excessive Data Exposure
**Click:** "Run Attack" on Excessive Data Exposure

**candump shows:**
```
vcan0  500   [8]  47 50 53 00 00 00 00 00 (x5)
```

---

### 5. Rate Limiting Failure
**Click:** "Run Attack" on Rate Limiting Failure

**candump shows:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00
vcan0  321   [8]  01 00 00 00 00 00 00 00
vcan0  320   [8]  01 00 00 00 00 00 00 00
vcan0  322   [8]  01 00 00 00 00 00 00 00
... (30 total frames)
```

---

### 6. OTA Manipulation
**Click:** "Run Attack" on OTA Manipulation

**candump shows:**
```
vcan0  700   [8]  30 00 00 00 00 00 00 00  # Check
vcan0  700   [8]  31 00 00 00 00 00 00 00  # Download
vcan0  700   [8]  32 00 00 00 00 00 00 00  # Install
vcan0  700   [8]  30 00 00 00 00 00 00 00  # Verify
vcan0  600   [8]  00 00 00 00 00 00 00 00  # Offline
```

---

## ✅ Success Indicators

For each attack executed from the UI:

### Browser
- [x] Button shows "Attack Running..." with spinner
- [x] Console shows success message
- [x] Console shows attack ID
- [x] Console shows expected CAN traffic
- [x] No errors in console

### candump Terminal
- [x] CAN frames appear in real-time
- [x] Frame IDs match attack type
- [x] Payloads are correct
- [x] Timing is progressive (not instant)

### Backend Terminal
- [x] Attack started log message
- [x] CAN frames sent log messages
- [x] Attack completed log message
- [x] No errors

### Dashboard (Optional)
- [x] Vehicle state updates
- [x] Real-time UI changes

---

## 🚨 Troubleshooting

### Issue: Button click does nothing

**Check browser console for errors:**
```javascript
Failed to fetch
// or
NetworkError
```

**Solution:**
1. Verify backend is running: `http://localhost:5000/api/attacks/list`
2. Check CORS is enabled in backend
3. Verify API URL in `frontend/src/config/api.ts`

---

### Issue: No CAN traffic in candump

**Check:**
1. Is vcan0 up? `ip link show vcan0`
2. Is backend in real mode (not simulation)?
3. Are you on Linux (not Windows)?

**Backend should show:**
```
✓ CAN interface 'vcan0' initialized successfully
```

**NOT:**
```
⚠ CAN listener not available in simulation mode
```

---

### Issue: Attack succeeds but wrong CAN traffic

**Check attack ID matches backend:**
- Frontend: `broken-authentication`
- Backend: `/api/attacks/broken-authentication`

**Verify mapping in `getAttackEndpoint()`**

---

## 🎯 Demo Workflow

### For Judges/Professors

**Setup:**
```bash
# Terminal 1
cd backend && python run_production.py

# Terminal 2 (visible to audience)
candump vcan0

# Terminal 3
cd frontend && npm run dev
```

**Demo:**

1. **Show UI** - Open browser to Attack Simulation page

2. **Show candump** - Point to terminal, "This monitors CAN bus traffic"

3. **Execute attack** - Click "Run Attack" on Replay Attack

4. **Point to candump** - "Notice frames appearing in real-time"
   ```
   vcan0  321   [8]  02 00 00 00 00 00 00 00
   vcan0  321   [8]  02 00 00 00 00 00 00 00
   vcan0  321   [8]  02 00 00 00 00 00 00 00
   ```

5. **Explain** - "UI button triggers real CAN frames on the bus"

6. **Execute different attack** - Show OTA Manipulation

7. **Show pattern** - "Different attacks produce different CAN patterns"

8. **Navigate to Dashboard** - "Vehicle state updates automatically"

9. **Navigate to Impact Analysis** - "Attack data is tracked"

**Key Points:**
- ✅ Real integration (not simulation)
- ✅ Observable with industry tools
- ✅ UI drives actual CAN traffic
- ✅ Professional automotive platform

---

## 📊 Architecture Flow

```
User clicks "Run Attack" in UI
    ↓
Frontend sends POST request
    ↓
Backend /api/attacks/{attack_id}
    ↓
AttackSimulationService executes
    ↓
CANService sends frames
    ↓
SocketCANManager transmits to vcan0
    ↓
candump shows frames in terminal
    ↓
Backend logs attack progression
    ↓
SocketIO updates frontend
    ↓
Dashboard/Impact Analysis update
```

---

## 📝 Files Modified

1. **NEW:** `frontend/src/config/api.ts`
   - API endpoint configuration
   - Attack endpoint mapping

2. **UPDATED:** `frontend/src/pages/AttackSimulation.tsx`
   - Real API integration
   - Attack ID synchronization
   - Error handling
   - Console logging

---

## 🔗 Related Documentation

- **ATTACK_SIMULATION_GUIDE.md** - Backend attack details
- **ATTACK_QUICK_REFERENCE.md** - Quick testing commands
- **TEST_CANSEND_COMMANDS.md** - Manual CAN testing

---

## ✅ Summary

**Before:**
- UI button → Fake timeout → Animation only

**After:**
- UI button → Backend API → Real CAN frames → candump shows traffic

**Status:** ✅ **COMPLETE AND READY**

**Testing:** Ready for Linux deployment with frontend UI

**Integration:** Frontend ↔ Backend ↔ SocketCAN ↔ candump

---

**Date:** June 3, 2026  
**Status:** ✅ INTEGRATED  
**Platform:** Linux with vcan0  
**Observable:** Click UI button, see CAN traffic in candump
