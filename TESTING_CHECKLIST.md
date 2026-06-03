# Attack Stats Fix - Testing Checklist

## Pre-Testing Setup

### Step 1: Start Backend
```bash
cd backend
source venv/bin/activate  # Linux/Mac
# OR
.\venv\Scripts\activate   # Windows
python run.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5000
 * SocketIO server started
 * CAN Manager initialized (simulation mode on Windows, real vcan0 on Linux)
```

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 3: Monitor CAN Traffic (Linux Only)
```bash
candump vcan0
```

---

## Attack Testing Checklist

### ✅ Test 1: Replay Attack

**Actions:**
1. Navigate to: http://localhost:5173/attack-simulation
2. Select "Replay Attack"
3. Click "Run Attack"

**Expected Results:**

| Component | Expected Behavior | Status |
|-----------|-------------------|--------|
| **API Activity Panel** | Shows 5 POST requests to `/unlock` | ⬜ |
| **CAN Activity Panel** | Shows 5 frames on CAN ID `0x321` | ⬜ |
| **Vehicle Reaction Panel** | Shows replay sequence events | ⬜ |
| **Transaction ID** | Same TXN-ATT-XXXXX in all panels | ⬜ |
| **candump (Linux)** | Shows 5x `vcan0 321 [8] 02 00...` | ⬜ |
| **Browser Console** | No errors | ⬜ |
| **Backend Console** | Shows attack execution logs | ⬜ |

---

### ✅ Test 2: IDOR Attack

**Actions:**
1. Select "IDOR"
2. Click "Run Attack"

**Expected Results:**

| Component | Expected Behavior | Status |
|-----------|-------------------|--------|
| **API Activity Panel** | Shows 3 requests (unlock, location, boot) | ⬜ |
| **CAN Activity Panel** | Shows 3 frames (0x321, 0x500, 0x330) | ⬜ |
| **Vehicle Reaction Panel** | Shows unauthorized access events | ⬜ |
| **Transaction ID** | Same TXN-ATT-XXXXX in all panels | ⬜ |
| **candump (Linux)** | Shows frames on 3 different CAN IDs | ⬜ |
| **Browser Console** | No errors | ⬜ |
| **Backend Console** | Shows IDOR execution | ⬜ |

---

### ✅ Test 3: Broken Authentication

**Actions:**
1. Select "Broken Authentication"
2. Click "Run Attack"

**Expected Results:**

| Component | Expected Behavior | Status |
|-----------|-------------------|--------|
| **API Activity Panel** | Shows 4 requests (unlock, horn, lights, engine) | ⬜ |
| **CAN Activity Panel** | Shows 4 frames (0x321, 0x320, 0x322, 0x400) | ⬜ |
| **Vehicle Reaction Panel** | Shows auth bypass sequence | ⬜ |
| **Transaction ID** | Same TXN-ATT-XXXXX in all panels | ⬜ |
| **candump (Linux)** | Shows 4 different CAN IDs | ⬜ |
| **Browser Console** | No errors | ⬜ |
| **Backend Console** | Shows broken auth execution | ⬜ |

---

### ✅ Test 4: Excessive Data Exposure

**Actions:**
1. Select "Excessive Data Exposure"
2. Click "Run Attack"

**Expected Results:**

| Component | Expected Behavior | Status |
|-----------|-------------------|--------|
| **API Activity Panel** | Shows 5 GET requests (locate, telemetry) | ⬜ |
| **CAN Activity Panel** | Shows 5 GPS frames (0x500) | ⬜ |
| **Vehicle Reaction Panel** | Shows privacy leak events | ⬜ |
| **Transaction ID** | Same TXN-ATT-XXXXX in all panels | ⬜ |
| **candump (Linux)** | Shows repeated 0x500 frames | ⬜ |
| **Browser Console** | No errors | ⬜ |
| **Backend Console** | Shows data exposure execution | ⬜ |

---

### ✅ Test 5: Rate Limiting Failure

**Actions:**
1. Select "Rate Limiting Failure"
2. Click "Run Attack"

**Expected Results:**

| Component | Expected Behavior | Status |
|-----------|-------------------|--------|
| **API Activity Panel** | Shows 7+ rapid burst requests | ⬜ |
| **CAN Activity Panel** | Shows high-frequency frames (multiple IDs) | ⬜ |
| **Vehicle Reaction Panel** | Shows system overload events | ⬜ |
| **Transaction ID** | Same TXN-ATT-XXXXX in all panels | ⬜ |
| **candump (Linux)** | Shows rapid burst of frames | ⬜ |
| **Browser Console** | No errors | ⬜ |
| **Backend Console** | Shows rate limiting execution | ⬜ |

---

### ✅ Test 6: OTA Manipulation

**Actions:**
1. Select "OTA Manipulation"
2. Click "Run Attack"

**Expected Results:**

| Component | Expected Behavior | Status |
|-----------|-------------------|--------|
| **API Activity Panel** | Shows 3 requests (check, download, install) | ⬜ |
| **CAN Activity Panel** | Shows 5 frames (0x700, 0x600) | ⬜ |
| **Vehicle Reaction Panel** | Shows firmware manipulation sequence | ⬜ |
| **Transaction ID** | Same TXN-ATT-XXXXX in all panels | ⬜ |
| **candump (Linux)** | Shows OTA CAN frames | ⬜ |
| **Browser Console** | No errors | ⬜ |
| **Backend Console** | Shows OTA manipulation execution | ⬜ |

---

## Impact Analysis Testing

### ✅ Test 7: Impact Analysis Page

**Actions:**
1. Execute at least 2 different attacks (e.g., Replay and Broken Auth)
2. Navigate to: http://localhost:5173/impact-analysis

**Expected Results:**

| Component | Expected Behavior | Status |
|-----------|-------------------|--------|
| **Execution History** | Shows both attacks in history | ⬜ |
| **Attack Details** | Click attack → shows full details | ⬜ |
| **Risk Distribution** | Shows 4 risk metrics (privacy, operational, safety, technical) | ⬜ |
| **Affected Systems** | Lists APIs, ECUs, CAN IDs | ⬜ |
| **Attack Timeline** | Shows event sequence | ⬜ |
| **Telemetry Charts** | API and CAN activity graphs render | ⬜ |
| **Attack Path** | Attack propagation visualization | ⬜ |
| **Vehicle Heat Map** | Affected components highlighted | ⬜ |

---

## Verification Script Testing

### ✅ Test 8: Run Verification Script

**Actions:**
```bash
python verify_attack_ids.py
```

**Expected Output:**
```
======================================================================
🔍 AutoAPI-X Attack ID Synchronization Verification
======================================================================

📄 Checking AttackSimulation.tsx...
   ✅ All 6 attack IDs found!

📄 Checking attackStore.ts...
   ✅ All 6 attack IDs found!

📄 Checking APIActivityPanel.tsx...
   ✅ All 6 attack IDs found!

📄 Checking CANActivityPanel.tsx...
   ✅ All 6 attack IDs found!

📄 Checking VehicleReactionPanel.tsx...
   ✅ All 6 attack IDs found!

======================================================================
📊 VERIFICATION SUMMARY
======================================================================
   ✅ PASS       - AttackSimulation.tsx
   ✅ PASS       - attackStore.ts
   ✅ PASS       - APIActivityPanel.tsx
   ✅ PASS       - CANActivityPanel.tsx
   ✅ PASS       - VehicleReactionPanel.tsx
======================================================================
   Result: 5/5 checks passed

   🎉 All attack IDs are synchronized!
   ✅ Attack stats display should work correctly
   ✅ Impact Analysis should receive data properly
```

---

## Backend API Testing (Optional)

### ✅ Test 9: Direct API Testing

Test each attack via curl/REST client:

```bash
# Replay Attack
curl -X POST http://localhost:5000/api/attacks/replay \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001","iterations":5}'

# Expected: {"success":true,"attack_id":"TXN-ATT-XXXXX",...}
```

**Check all 6 endpoints:**
- ⬜ `/api/attacks/replay`
- ⬜ `/api/attacks/idor`
- ⬜ `/api/attacks/broken-authentication`
- ⬜ `/api/attacks/excessive-data-exposure`
- ⬜ `/api/attacks/rate-limiting-failure`
- ⬜ `/api/attacks/ota-manipulation`

---

## Common Issues & Fixes

### Issue 1: "Failed to execute attack" in UI
**Symptoms:** Alert shows "Failed to execute attack"
**Check:**
- ⬜ Backend is running on port 5000
- ⬜ No CORS errors in browser console
- ⬜ Backend logs show incoming request

**Fix:** Restart backend with `python run.py`

---

### Issue 2: No CAN traffic in candump (Linux)
**Symptoms:** candump shows nothing when attack runs
**Check:**
- ⬜ vcan0 interface exists (`ip link show vcan0`)
- ⬜ Backend logs show "CAN Manager initialized (socketcan mode)"
- ⬜ Backend is running on Linux (not Windows simulation mode)

**Fix:**
```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

---

### Issue 3: Attack panels show no data
**Symptoms:** API/CAN/Vehicle panels remain empty
**Check:**
- ⬜ Browser console for errors
- ⬜ Attack IDs match in all files (run `verify_attack_ids.py`)
- ⬜ Backend returns `success: true`

**Fix:** Verify attackStore.ts has correct IDs (see ATTACK_STATS_FIX.md)

---

### Issue 4: Impact Analysis shows no attacks
**Symptoms:** Impact Analysis page is empty after running attacks
**Check:**
- ⬜ attackStore is receiving addExecution calls
- ⬜ Attack IDs match between AttackSimulation.tsx and attackStore.ts
- ⬜ Browser console shows no errors

**Fix:** Clear browser cache and retry attacks

---

## Test Results Summary

### Overall Status
- ⬜ All 6 attacks execute successfully
- ⬜ All panels display data correctly
- ⬜ Transaction IDs flow end-to-end
- ⬜ Impact Analysis receives data
- ⬜ No console errors
- ⬜ CAN traffic visible (Linux)

### Pass Criteria
- ✅ At least 24/27 checks passing (89%)
- ✅ All 6 attacks generate CAN traffic
- ✅ Impact Analysis shows attack data
- ✅ No critical errors in console

---

## Sign-Off

**Tested By:** _________________

**Date:** _________________

**Result:** ⬜ PASS  ⬜ FAIL

**Notes:**
```
_________________________________________________
_________________________________________________
_________________________________________________
```

---

## Next Steps After Testing

If all tests pass:
1. ✅ Platform is ready for demonstration
2. ✅ Document any edge cases found
3. ✅ Prepare demo script for judges

If tests fail:
1. ❌ Review failed test details
2. ❌ Check error messages in console
3. ❌ Refer to ATTACK_STATS_FIX.md for troubleshooting
4. ❌ Re-run verify_attack_ids.py
5. ❌ Reach out with specific error messages

---

**Testing Status: Ready to Execute** 🚀
