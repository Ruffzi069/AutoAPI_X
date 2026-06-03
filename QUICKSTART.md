# AutoAPI-X - Quick Start Guide

## Get Running in 5 Minutes

### Prerequisites
- Linux system (Ubuntu, Debian, Fedora, etc.)
- Python 3.8+
- sudo access

---

## Option 1: Automated Setup (Recommended)

```bash
# Make script executable (Linux/Mac)
chmod +x start.sh

# Run the start script
./start.sh
```

The script will:
1. Check Python installation
2. Setup vcan0 interface
3. Create virtual environment
4. Install dependencies
5. Start the server

---

## Option 2: Manual Setup

### Step 1: Setup CAN Interface
```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

### Step 2: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Start Server
```bash
python app.py
```

---

## Verify Installation

### Terminal 1: Monitor CAN Traffic
```bash
candump vcan0
```

### Terminal 2: Test API
```bash
# Make test script executable
chmod +x test_api.py

# Run tests
python test_api.py
```

---

## Quick API Tests

```bash
# System status
curl http://localhost:5000/api/system/status

# Get vehicles
curl http://localhost:5000/api/vehicles

# Unlock vehicle (watch candump!)
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/unlock

# Start engine (watch candump!)
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/engine/start
```

---

## What You Should See

### In Flask Console:
```
✓ Database initialized successfully
✓ Demo data seeded successfully
✓ CAN interface 'vcan0' initialized successfully
 * Running on http://0.0.0.0:5000
```

### In candump Terminal:
```
vcan0  321   [8]  02 00 00 00 00 00 00 00    # Unlock
vcan0  324   [8]  05 00 00 00 00 00 00 00    # Engine start
```

### In API Response:
```json
{
  "success": true,
  "message": "Vehicle unlocked",
  "vehicle": {
    "vin": "5YJ3E1EA1KF000001",
    "doors_status": "unlocked",
    ...
  }
}
```

---

## Troubleshooting

### "Cannot find device vcan0"
```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

### "Port 5000 already in use"
Edit `backend/app.py`, change port to 5001:
```python
socketio.run(app, debug=True, host='0.0.0.0', port=5001)
```

### "Module not found"
```bash
cd backend
pip install -r requirements.txt
```

---

## Next Steps

1. ✅ Verify all tests pass
2. 📖 Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
3. 📋 Check [PHASE1_CHECKLIST.md](PHASE1_CHECKLIST.md) for acceptance criteria
4. 🚀 Ready for Phase 2 development

---

## Demo Vehicle Details

- **Model:** Tesla Model 3
- **VIN:** `5YJ3E1EA1KF000001`
- **Owner:** User A
- **Battery:** 84%
- **Firmware:** v1.2.3

---

## Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/system/status` | System health check |
| GET | `/api/vehicles` | List all vehicles |
| GET | `/api/vehicles/<vin>` | Get vehicle details |
| POST | `/api/vehicles/<vin>/lock` | Lock doors |
| POST | `/api/vehicles/<vin>/unlock` | Unlock doors |
| POST | `/api/vehicles/<vin>/boot/open` | Open boot |
| POST | `/api/vehicles/<vin>/engine/start` | Start engine |

---

**You're ready to go!** 🚗💨
