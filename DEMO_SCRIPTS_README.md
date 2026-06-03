# Demo Scripts - Quick Start

## 🚀 One-Command Demo Startup

We've created automated scripts to start the entire AutoAPI-X platform with one command.

---

## 📋 Available Scripts

### 1. `start_demo.sh` - Start Everything
**Purpose:** Start backend, frontend, and setup vcan0

**Usage:**
```bash
chmod +x start_demo.sh
./start_demo.sh
```

**What it does:**
- ✅ Creates and brings up vcan0
- ✅ Checks all dependencies
- ✅ Starts backend server
- ✅ Starts frontend dev server
- ✅ Provides instructions for next steps

**Output:**
```
🚀 AutoAPI-X - Starting Demo Environment
==========================================

✓ Running on Linux
✓ vcan0 is UP
✓ Python 3 found
✓ Node.js found
✓ candump found

==========================================
Starting Backend Server...
==========================================
✓ Backend started (PID: 12345)
✓ Backend responding on http://localhost:5000

==========================================
Starting Frontend Server...
==========================================
✓ Frontend started (PID: 12346)

==========================================
✅ AutoAPI-X Demo Environment Ready
==========================================

🌐 Frontend:  http://localhost:5173
🔧 Backend:   http://localhost:5000
📡 vcan0:     Ready for CAN traffic
```

---

### 2. `stop_demo.sh` - Stop Everything
**Purpose:** Stop all running services

**Usage:**
```bash
chmod +x stop_demo.sh
./stop_demo.sh
```

**What it does:**
- ✅ Stops backend server
- ✅ Stops frontend server
- ✅ Cleans up processes
- ✅ Optionally removes vcan0

---

## 🎯 Complete Demo Workflow

### Automated Start (Recommended)

**Step 1: Start everything**
```bash
./start_demo.sh
```

**Step 2: Open CAN monitor**
```bash
# In a new terminal
candump vcan0
```

**Step 3: Open browser**
```
http://localhost:5173
Navigate to: Attack Simulation
```

**Step 4: Test**
```
Click: "Run Attack" on any attack
Watch: candump shows CAN frames
```

**Step 5: Stop when done**
```bash
./stop_demo.sh
```

---

### Manual Start (Alternative)

**Step 1: Setup vcan0**
```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

**Step 2: Start Backend**
```bash
cd backend
python run_production.py
```

**Step 3: Start Frontend**
```bash
cd frontend
npm run dev
```

**Step 4: Open CAN monitor**
```bash
candump vcan0
```

---

## 📊 Terminal Layout Recommendation

### Layout 1: Side-by-Side (Horizontal Split)
```
┌──────────────────────┬──────────────────────┐
│                      │                      │
│  Terminal 1          │  Terminal 2          │
│  Backend running     │  candump vcan0       │
│                      │  (CAN traffic)       │
│                      │                      │
└──────────────────────┴──────────────────────┘
        Browser (Attack Simulation UI)
```

### Layout 2: Tiled (Quad Split)
```
┌──────────────────────┬──────────────────────┐
│  Terminal 1          │  Terminal 2          │
│  Backend             │  candump vcan0       │
├──────────────────────┼──────────────────────┤
│  Terminal 3          │  Browser             │
│  Frontend logs       │  Attack UI           │
└──────────────────────┴──────────────────────┘
```

### Layout 3: Demo Presentation (Recommended)
```
┌─────────────────────────────────────────────┐
│         Browser (Attack Simulation)         │
│         (Large, center screen)              │
└─────────────────────────────────────────────┘
┌──────────────────────┬──────────────────────┐
│  Terminal 1          │  Terminal 2          │
│  candump vcan0       │  Backend logs        │
│  (Large font)        │  (Optional)          │
└──────────────────────┴──────────────────────┘
```

---

## 🎓 Demo Checklist

### Before Demo
- [ ] Run `./start_demo.sh`
- [ ] Verify backend starts successfully
- [ ] Verify frontend loads
- [ ] Open `candump vcan0` in visible terminal
- [ ] Increase candump font size for visibility
- [ ] Open browser to Attack Simulation page
- [ ] Test one attack to verify everything works

### During Demo
- [ ] Show UI and explain platform
- [ ] Point to candump terminal (empty)
- [ ] Click "Run Attack"
- [ ] Immediately point to candump showing frames
- [ ] Explain: "UI drives real CAN traffic"
- [ ] Try different attack type
- [ ] Show different CAN pattern
- [ ] Navigate to Dashboard
- [ ] Show vehicle state updated

### After Demo
- [ ] Run `./stop_demo.sh`
- [ ] Clean up any terminals
- [ ] Answer questions

---

## 🔍 Troubleshooting

### Script fails: "vcan module not found"

**Error:**
```
❌ Failed to load vcan module
```

**Solution:**
```bash
# Install Linux headers
sudo apt install linux-headers-$(uname -r)

# Load module
sudo modprobe vcan
```

---

### Script fails: "Backend not responding"

**Check:**
```bash
# Is backend running?
ps aux | grep run_production

# Check logs
tail -f backend/logs/*.log

# Test manually
curl http://localhost:5000/api/system/status
```

---

### Script fails: "Frontend dependencies error"

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Script Customization

### Change Ports

**Edit `start_demo.sh`:**
```bash
# Backend port (default: 5000)
# Edit backend/config/config.py

# Frontend port (default: 5173)
# Edit frontend/vite.config.ts
```

### Auto-open Browser

**Add to `start_demo.sh` (end):**
```bash
# Auto-open browser after 5 seconds
sleep 5
xdg-open http://localhost:5173 &
```

### Auto-start candump

**Add to `start_demo.sh` (after frontend start):**
```bash
# Start candump in new terminal
gnome-terminal -- candump vcan0 &
# or
xterm -e candump vcan0 &
```

---

## 🎯 Quick Reference

### Start Demo
```bash
./start_demo.sh
```

### Open CAN Monitor
```bash
candump vcan0
```

### Test Attack (CLI)
```bash
curl -X POST http://localhost:5000/api/attacks/replay \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001","iterations":5}'
```

### Stop Demo
```bash
./stop_demo.sh
```

### Check Status
```bash
# Backend
curl http://localhost:5000/api/system/status

# Frontend
curl http://localhost:5173

# vcan0
ip link show vcan0
```

---

## 📚 Related Documentation

- **FINAL_TESTING_GUIDE.md** - Complete testing guide
- **COMPLETE_INTEGRATION_SUMMARY.md** - Full integration overview
- **FRONTEND_ATTACK_INTEGRATION.md** - UI integration details
- **ATTACK_SIMULATION_GUIDE.md** - Attack specifications

---

## ✅ Summary

**Automated Setup:** ✅ Available  
**One Command:** `./start_demo.sh`  
**Setup Time:** ~30 seconds  
**Manual Setup:** Also documented  
**Demo Ready:** ✅ YES

---

**Files:**
- `start_demo.sh` - Automated startup
- `stop_demo.sh` - Automated cleanup
- `DEMO_SCRIPTS_README.md` - This file

**Usage:**
```bash
chmod +x start_demo.sh stop_demo.sh
./start_demo.sh
# ... run demo ...
./stop_demo.sh
```

**Status:** 🚀 **READY FOR DEMO**
