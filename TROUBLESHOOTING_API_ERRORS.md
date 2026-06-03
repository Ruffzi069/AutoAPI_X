# Troubleshooting API Errors - "Unexpected token '<', "<!doctype "..."

## 🔍 Problem Analysis

The error `SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON` means:

1. **The frontend is trying to parse JSON**
2. **But receiving HTML instead**
3. **This happens when the backend endpoint doesn't exist or returns an error page**

---

## ✅ Solution Steps

### Step 1: Verify Backend is Running

The most common cause is that the **backend server is not running**.

**Check if backend is running:**

```bash
# Windows PowerShell or CMD
netstat -ano | findstr :5000
```

**Expected Output:**
```
TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    <PID>
```

**If you see nothing**, the backend is NOT running.

---

### Step 2: Start the Backend Server

**Navigate to backend folder:**
```bash
cd C:\Users\daksh\OneDrive\Documents\AutoAPI-X\backend
```

**Install dependencies (if not already done):**
```bash
pip install -r requirements.txt
```

**Start the backend server:**
```bash
python run.py
```

**Expected Output:**
```
============================================================
AutoAPI-X - Connected Vehicle API Security Platform
============================================================
Backend server starting...
API endpoints available at http://localhost:5000/api
SocketIO enabled for real-time updates
============================================================
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.x.x:5000
Press CTRL+C to quit
```

**Leave this terminal window open** - the backend must stay running.

---

### Step 3: Test Backend Endpoints

Open a **new terminal window** and test the endpoints:

**Test 1: Get all vehicles**
```bash
curl http://localhost:5000/api/vehicles
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "vehicles": [...]
}
```

**Test 2: Horn endpoint**
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/horn
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Horn activated",
  "vehicle": {...}
}
```

**If you get HTML instead of JSON**, the endpoint doesn't exist or the route is incorrect.

---

### Step 4: Verify Frontend is Built

**Navigate to frontend folder:**
```bash
cd C:\Users\daksh\OneDrive\Documents\AutoAPI-X\frontend
```

**Rebuild frontend with error handling updates:**
```bash
npm run build
```

**Start frontend dev server:**
```bash
npm run dev
```

**Expected Output:**
```
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

### Step 5: Test in Browser

1. **Open browser**: http://localhost:5173
2. **Open DevTools**: Press `F12`
3. **Go to Console tab**
4. **Click any vehicle control** (e.g., Horn)

**If you still see the error**, check the Console for the full error message:

```
API Error [http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/horn]: Error: Server returned 404: Expected JSON but got text/html
```

This tells you:
- ✅ Backend is running (it responded)
- ❌ Endpoint doesn't exist (404 error)
- ❌ Flask returned HTML error page instead of JSON

---

## 🔧 Common Issues & Fixes

### Issue 1: Backend Not Running
**Symptom**: `Failed to fetch` or `Network error`

**Fix**:
```bash
cd backend
python run.py
```

---

### Issue 2: Port 5000 Already in Use
**Symptom**: `Address already in use`

**Fix (Windows)**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

---

### Issue 3: CORS Error
**Symptom**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Fix**: Already configured in `app.py`:
```python
CORS(app)
```

If still seeing CORS errors, restart backend server.

---

### Issue 4: Wrong API Base URL
**Symptom**: 404 errors for all endpoints

**Check**: `frontend/src/services/api.ts`
```typescript
const API_BASE = 'http://localhost:5000/api';  // Must match backend port
```

**Verify backend is listening on port 5000**:
```bash
curl http://localhost:5000/api/system/health
```

---

### Issue 5: Database Not Initialized
**Symptom**: Backend crashes when accessing vehicles

**Fix**:
```bash
cd backend
python -c "from database.database import init_db, seed_data; init_db(); seed_data()"
```

---

## 🧪 Complete Test Sequence

Run these commands in order to verify everything works:

```bash
# Terminal 1: Start Backend
cd C:\Users\daksh\OneDrive\Documents\AutoAPI-X\backend
python run.py

# Terminal 2: Test Backend
curl http://localhost:5000/api/vehicles
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/horn

# Terminal 3: Start Frontend
cd C:\Users\daksh\OneDrive\Documents\AutoAPI-X\frontend
npm run dev

# Browser: Open http://localhost:5173
# Click controls and verify they work
```

---

## 📊 Diagnostic Checklist

Use this checklist to diagnose the issue:

- [ ] Backend server is running (`python run.py`)
- [ ] Backend responds to health check: `curl http://localhost:5000/api/system/health`
- [ ] Backend returns JSON (not HTML) for vehicle endpoints
- [ ] Frontend dev server is running (`npm run dev`)
- [ ] Browser console shows no CORS errors
- [ ] Browser Network tab shows 200 OK responses
- [ ] Database exists at `backend/database/autoapi.db`
- [ ] Demo vehicle exists with VIN `5YJ3E1EA1KF000001`

---

## 🔍 Enhanced Error Logging

I've updated the API service to provide better error messages. Now when you click a control, check the browser console:

**Before (unhelpful)**:
```
Error: horn SyntaxError: Unexpected token '<'
```

**After (detailed)**:
```
API Error [http://localhost:5000/api/vehicles/.../horn]: 
Server returned 404: Expected JSON but got text/html
```

This tells you:
1. Exact URL being called
2. HTTP status code (404 = not found)
3. What was expected vs what was received

---

## ✅ Quick Fix Summary

**Most likely cause**: Backend not running

**Quick fix**:
```bash
# Open NEW terminal
cd C:\Users\daksh\OneDrive\Documents\AutoAPI-X\backend
python run.py

# Keep this terminal open!
```

Then refresh your browser and try again.

---

## 📞 Still Having Issues?

If you're still seeing errors after following these steps, check:

1. **Backend terminal output** - Are there any Python errors?
2. **Browser DevTools Console** - What's the exact error message?
3. **Browser DevTools Network tab** - What's the response for the failed request?
4. **Windows Firewall** - Is it blocking localhost connections? (unlikely but possible)

---

## 🎯 Expected Behavior

When everything is working correctly:

1. **Click "Horn" button** in Google Pixel Controller
2. **Browser Console** shows: `API call successful`
3. **Backend Terminal** shows: 
   ```
   CAN Frame: TCU → Gateway ECU (0x123)
   CAN Frame: Gateway ECU → Body ECU (0x321)
   Horn activated: 3 seconds
   ```
4. **Vehicle SVG** shows horn animation (sound waves)
5. **Live Activity Feed** shows: "Horn Activated"
6. **API Traffic Monitor** shows the POST request

All of this happens in **real-time** via SocketIO.

---

## 🚀 After Fixing

Once the backend is running and responding correctly:

1. All controls should work instantly
2. Vehicle animations should play
3. Monitors should show real-time data
4. No more "Unexpected token" errors

The improved error handling will now show clear messages if anything goes wrong.
