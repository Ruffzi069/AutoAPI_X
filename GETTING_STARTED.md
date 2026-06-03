# Getting Started with AutoAPI-X

Welcome to **AutoAPI-X** - Connected Vehicle API Security Simulation Platform!

---

## 🎯 What is AutoAPI-X?

AutoAPI-X is an **educational cybersecurity platform** that demonstrates how modern connected vehicles process API requests and translate them into CAN bus commands. It's designed for:

- 🎓 **Education** - Learn about connected vehicle architecture
- 🔬 **Research** - Study automotive cybersecurity
- 🛡️ **Security** - Understand vehicle API vulnerabilities
- 💻 **Development** - Build automotive security tools

**Important:** This is NOT a vehicle simulator or racing game!

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Linux System** (Ubuntu 20.04+, Debian, Fedora, or similar)
  - Windows/Mac: API works, but CAN frames are simulated
- ✅ **Python 3.8+** installed
- ✅ **sudo access** (for CAN interface setup on Linux)
- ✅ **10 minutes** of your time

---

## 🚀 Quick Start (3 Steps)

### Step 1: Setup CAN Interface (Linux only)

```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

### Step 2: Start the Server

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
start.bat
```

### Step 3: Test the API

```bash
# In a new terminal
python test_api.py
```

**That's it!** 🎉 You're running AutoAPI-X!

---

## 🧪 Verify Everything Works

### Terminal 1: Start Server
```bash
cd backend
python app.py
```

**Expected output:**
```
============================================================
AutoAPI-X - Connected Vehicle API Security Platform
============================================================
✓ Database initialized successfully
✓ Demo data seeded successfully
✓ CAN interface 'vcan0' initialized successfully
 * Running on http://0.0.0.0:5000
```

### Terminal 2: Monitor CAN Traffic (Linux only)
```bash
candump vcan0
```

### Terminal 3: Test API
```bash
# System status
curl http://localhost:5000/api/system/status

# Unlock vehicle (watch Terminal 2 for CAN frame!)
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/unlock
```

**In Terminal 2, you should see:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00
```

✅ **Success!** Your API request generated a real CAN frame!

---

## 🎮 Try These Commands

```bash
# Get all vehicles
curl http://localhost:5000/api/vehicles

# Get specific vehicle
curl http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001

# Unlock doors (CAN ID: 0x321, CMD: 0x02)
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/unlock

# Lock doors (CAN ID: 0x321, CMD: 0x01)
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/lock

# Open boot (CAN ID: 0x323, CMD: 0x03)
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/boot/open

# Start engine (CAN ID: 0x324, CMD: 0x05)
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/engine/start
```

Watch the CAN frames appear in `candump vcan0`! 🚗💨

---

## 📊 Understanding the Flow

When you call an API endpoint, here's what happens:

```
1. Your curl command
   ↓
2. Flask receives HTTP POST request
   ↓
3. VehicleService processes the request
   ↓
4. CANService generates CAN frame
   ↓
5. SocketCANManager sends frame to vcan0
   ↓
6. candump displays the frame
   ↓
7. Database logs everything
   ↓
8. SocketIO broadcasts update
   ↓
9. API returns success response
```

This is how **real connected vehicles** work!

---

## 🚗 Demo Vehicle

Your system includes a pre-configured Tesla Model 3:

- **VIN:** `5YJ3E1EA1KF000001`
- **Owner:** User A
- **Battery:** 84%
- **Firmware:** v1.2.3
- **Status:** Connected

Use this VIN in all API calls.

---

## 🔧 ECU Mappings

AutoAPI-X simulates these vehicle ECUs:

| ECU | CAN ID | Controls |
|-----|--------|----------|
| Door ECU | 0x321 | Door locks |
| Horn ECU | 0x322 | Horn |
| Boot ECU | 0x323 | Trunk/boot |
| Ignition ECU | 0x324 | Engine |
| Lights ECU | 0x325 | Lights |
| GPS ECU | 0x327 | GPS |
| Infotainment ECU | 0x400 | Infotainment |

---

## 📚 Documentation

- **README.md** - Project overview and installation
- **QUICKSTART.md** - 5-minute quick start
- **SETUP_INSTRUCTIONS.md** - Detailed setup guide
- **API_DOCUMENTATION.md** - Complete API reference
- **ARCHITECTURE.md** - System architecture
- **PHASE1_CHECKLIST.md** - Acceptance criteria
- **PROJECT_SUMMARY.md** - Project summary

---

## 🧪 Run Automated Tests

```bash
python test_api.py
```

**Expected output:**
```
============================================================
  AutoAPI-X Phase 1 - API Test Suite
============================================================

✅ PASS - System Status
✅ PASS - Get All Vehicles
✅ PASS - Get Vehicle by VIN
✅ PASS - Unlock Vehicle
✅ PASS - Lock Vehicle
✅ PASS - Open Boot
✅ PASS - Start Engine

Results: 7/7 tests passed

🎉 All tests passed! Phase 1 is working correctly.
```

---

## 🐛 Troubleshooting

### "Cannot find device vcan0"

**Solution:**
```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

### "Port 5000 already in use"

**Solution:** Edit `backend/app.py`, change port:
```python
socketio.run(app, debug=True, host='0.0.0.0', port=5001)
```

### "Module not found"

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### CAN frames not appearing in candump

**Check:**
1. Is vcan0 up? `ip link show vcan0`
2. Is candump running? `candump vcan0`
3. Is Flask showing CAN initialization success?

---

## 🎓 Learning Path

### Beginner
1. ✅ Get the system running
2. ✅ Make API calls with curl
3. ✅ Watch CAN frames in candump
4. ✅ Understand the flow

### Intermediate
1. 📖 Read ARCHITECTURE.md
2. 🔍 Explore the code structure
3. 🗄️ Inspect the SQLite database
4. 📊 Review the logs

### Advanced
1. 🔧 Add new vehicle actions
2. 🚗 Add new ECUs
3. 🔌 Add new API endpoints
4. 🛡️ Prepare for Phase 2

---

## 🚀 What's Next?

### Phase 2: Vehicle Digital Twin
- Enhanced vehicle simulation
- Google Pixel controller
- Mobile app integration

### Phase 3: Monitoring Dashboards
- Real-time CAN visualization
- API traffic monitoring
- React frontend

### Phase 4: Attack Simulation
- Replay attacks
- Fuzzing
- Man-in-the-middle
- Vulnerability demonstrations

---

## 💡 Tips

1. **Keep candump running** - It's the best way to see what's happening
2. **Check the logs** - Everything is logged to the database
3. **Use the test script** - `test_api.py` validates everything
4. **Read the docs** - Comprehensive documentation is provided
5. **Experiment** - Try different API calls and watch the CAN traffic

---

## 🎯 Success Checklist

- [ ] Flask server starts without errors
- [ ] vcan0 interface is up (Linux)
- [ ] candump shows CAN frames (Linux)
- [ ] API calls return 200 OK
- [ ] Vehicle state updates in database
- [ ] All tests pass in test_api.py
- [ ] You understand the architecture flow

---

## 📞 Need Help?

1. Check **SETUP_INSTRUCTIONS.md** for detailed setup
2. Review **API_DOCUMENTATION.md** for API details
3. Read **ARCHITECTURE.md** to understand the design
4. Run `test_api.py` to validate your setup

---

## 🎉 You're Ready!

You now have a fully functional connected vehicle API security platform!

**Next steps:**
1. Experiment with the API
2. Explore the code
3. Read the architecture documentation
4. Prepare for Phase 2

**Welcome to AutoAPI-X!** 🚗🔐

---

*AutoAPI-X - Making automotive cybersecurity education accessible*
