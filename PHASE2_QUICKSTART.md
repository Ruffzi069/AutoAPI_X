# AutoAPI-X Phase 2 - Quick Start Guide

## 🚀 Start the Dashboard

### One-Click Startup

```cmd
start_phase2.bat
```

This will:
1. Start backend on `http://localhost:5000`
2. Start frontend on `http://localhost:5173`
3. Open your browser automatically

---

## 🎮 Using the Dashboard

### Google Pixel Controller (Left Panel)

**Vehicle Access:**
- **Lock** - Lock all doors
- **Unlock** - Unlock all doors

**Vehicle Functions:**
- **Horn** - Activate horn (2 seconds)
- **Flash Lights** - Flash headlights/taillights (3 seconds)
- **Open Boot** - Open trunk
- **Close Boot** - Close trunk

**Vehicle Power:**
- **Start Engine** - Start the engine
- **Stop Engine** - Stop the engine

**Location:**
- **Locate Vehicle** - GPS tracking (5 seconds)

### Vehicle Digital Twin (Center Panel)

Watch the vehicle react in real-time:
- 🔒 Lock/Unlock indicators
- 📦 Boot open/close animation
- 💡 Lights flashing effect
- 📢 Horn pulse animation
- ⚡ Engine running glow
- 📍 GPS tracking beacon
- 🔋 Battery level display

### Vehicle Info Panel (Right Panel)

**System Status:**
- Battery percentage
- Network status
- GPS status
- Firmware version

**Vehicle State:**
- Doors (locked/unlocked)
- Boot (open/closed)
- Engine (on/off)
- Lights (on/off/flashing)

**Activity Log:**
- Last 10 actions
- Timestamps
- Color-coded by type

---

## ✅ Verify It's Working

### 1. Check Backend
Backend terminal should show:
```
✓ Database initialized successfully
✓ CAN interface 'vcan0' initialized successfully
Backend server starting...
API endpoints available at http://localhost:5000/api
SocketIO enabled for real-time updates
```

### 2. Check Frontend
Frontend terminal should show:
```
VITE v8.0.16  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 3. Check Browser Console (F12)
```
✓ Connected to AutoAPI-X backend
✓ AutoAPI-X Dashboard initialized
```

### 4. Test a Control
1. Click "Unlock" button
2. Watch the vehicle icon change
3. See "Vehicle unlocked" in activity log
4. Backend shows CAN frame sent

---

## 🔧 Troubleshooting

### Backend won't start
```cmd
cd backend
pip install -r requirements.txt
python run_production.py
```

### Frontend won't start
```cmd
cd frontend
npm install
npm run dev
```

### No real-time updates
- Check backend is running
- Open browser console (F12)
- Look for "Connected to AutoAPI-X backend"
- If not connected, restart backend

### Port already in use
- Backend: Change port in `backend/config/config.py`
- Frontend: Change port in `frontend/vite.config.ts`

---

## 📊 What to Expect

### Response Times
- Button click → Visual update: **< 100ms**
- API call → Database update: **< 50ms**
- Socket.IO broadcast: **< 50ms**
- Total end-to-end: **< 200ms**

### Animations
- Door lock/unlock: **500ms**
- Horn pulse: **2 seconds** (3 waves)
- Lights flash: **3 seconds**
- GPS tracking: **5 seconds**
- Boot open/close: **800ms**

### CAN Frames
Every action generates a CAN frame:
- Lock/Unlock: `0x321` (Door ECU)
- Horn: `0x322` (Horn ECU)
- Boot: `0x323` (Boot ECU)
- Engine: `0x324` (Ignition ECU)
- Lights: `0x325` (Lights ECU)
- GPS: `0x327` (GPS ECU)

---

## 🎯 Test Scenarios

### Scenario 1: Basic Control
1. Click "Unlock"
2. Click "Open Boot"
3. Click "Start Engine"
4. Observe all changes in real-time

### Scenario 2: Visual Effects
1. Click "Horn" - Watch pulse animation
2. Click "Flash Lights" - Watch flashing
3. Click "Locate Vehicle" - Watch GPS beacon

### Scenario 3: State Synchronization
1. Click "Unlock"
2. Check Info Panel shows "unlocked"
3. Check Activity Log shows "Vehicle unlocked"
4. Check Vehicle Twin shows unlock indicator

---

## 📱 Mobile Testing

The dashboard is responsive:

**Desktop (>1280px):**
- 3-column layout
- All features visible

**Tablet (768px-1280px):**
- 2-column layout
- Controller at bottom

**Mobile (<768px):**
- Single column
- Stacked panels
- Scrollable

---

## 🔍 Debugging

### Enable Verbose Logging

**Backend:**
```python
# In backend/app.py
app.config['DEBUG'] = True
```

**Frontend:**
```typescript
// In src/services/socket.ts
socket.on('connect', () => {
  console.log('✓ Connected:', socket.id);
});
```

### Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. Watch Socket.IO messages

### Check Backend Logs
Watch for:
- API calls
- CAN frames
- Database updates
- SocketIO emissions

---

## 🎉 Success Indicators

You'll know it's working when:

✅ Backend shows "SocketIO enabled"  
✅ Frontend shows "Connected to AutoAPI-X backend"  
✅ Clicking buttons triggers visual changes  
✅ Activity log updates automatically  
✅ Info panel shows current state  
✅ Backend logs show CAN frames  

---

## 📚 Next Steps

Phase 2 is complete! You now have:
- ✅ Fully functional dashboard
- ✅ Real-time vehicle control
- ✅ Visual feedback system
- ✅ Complete API integration

**Ready for Phase 3:** Attack simulations and security testing

---

## 🆘 Need Help?

Check these files:
- `PHASE2_COMPLETE.md` - Full implementation details
- `PHASE2_SPECIFICATION.md` - Original requirements
- `API_DOCUMENTATION.md` - API reference
- `TROUBLESHOOTING.md` - Common issues

---

**AutoAPI-X Phase 2** - Connected Vehicle Dashboard  
**Status:** ✅ Complete and Ready to Use
