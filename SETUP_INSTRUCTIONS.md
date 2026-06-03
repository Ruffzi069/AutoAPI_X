# AutoAPI-X Phase 1 - Setup Instructions

## Quick Start Guide

Follow these steps to get AutoAPI-X Phase 1 running on your system.

## Prerequisites

- **Operating System:** Linux (Ubuntu 20.04+, Debian, Fedora, or similar)
- **Python:** 3.8 or higher
- **Permissions:** sudo access for CAN interface setup

## Step-by-Step Setup

### 1. Install System Dependencies

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y python3 python3-pip python3-venv can-utils
```

#### Fedora/RHEL:
```bash
sudo dnf install -y python3 python3-pip can-utils
```

### 2. Setup Virtual CAN Interface (vcan0)

The virtual CAN interface is required for CAN frame simulation.

```bash
# Load the vcan kernel module
sudo modprobe vcan

# Create virtual CAN interface named vcan0
sudo ip link add dev vcan0 type vcan

# Bring the interface up
sudo ip link set up vcan0

# Verify the interface is running
ip link show vcan0
```

**Expected output:**
```
5: vcan0: <NOARP,UP,LOWER_UP> mtu 72 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/can
```

### 3. Make vcan0 Persistent (Optional)

To automatically create vcan0 on system boot:

#### Using systemd:

Create a service file:
```bash
sudo nano /etc/systemd/system/vcan0.service
```

Add the following content:
```ini
[Unit]
Description=Virtual CAN Interface
After=network.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/sbin/modprobe vcan
ExecStart=/sbin/ip link add dev vcan0 type vcan
ExecStart=/sbin/ip link set up vcan0
ExecStop=/sbin/ip link delete vcan0

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl enable vcan0.service
sudo systemctl start vcan0.service
```

### 4. Install Python Dependencies

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Linux/Mac
# OR
venv\Scripts\activate  # On Windows (if testing without CAN)

# Install required packages
pip install -r requirements.txt
```

### 5. Initialize and Run the Application

```bash
# Make sure you're in the backend directory
cd backend

# Run the Flask application
python app.py
```

**Expected output:**
```
============================================================
AutoAPI-X - Connected Vehicle API Security Platform
============================================================
Backend server starting...
API endpoints available at http://localhost:5000/api
SocketIO enabled for real-time updates
============================================================
✓ Database initialized successfully
✓ Demo data seeded successfully
  - Demo Vehicle: Tesla Model 3 (VIN: 5YJ3E1EA1KF000001)
  - Owner: User A
  - Battery: 84%
  - Firmware: v1.2.3
✓ CAN interface 'vcan0' initialized successfully
 * Running on http://0.0.0.0:5000
```

### 6. Verify CAN Traffic (In a New Terminal)

Open a new terminal and run:

```bash
candump vcan0
```

This will monitor all CAN frames on the vcan0 interface.

### 7. Test the API

#### Test 1: System Status
```bash
curl http://localhost:5000/api/system/status
```

#### Test 2: Get All Vehicles
```bash
curl http://localhost:5000/api/vehicles
```

#### Test 3: Unlock Vehicle (Watch candump output!)
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/unlock
```

You should see a CAN frame in the candump terminal:
```
vcan0  321   [8]  02 00 00 00 00 00 00 00
```

#### Test 4: Start Engine
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/engine/start
```

You should see:
```
vcan0  324   [8]  05 00 00 00 00 00 00 00
```

## Verification Checklist

Use this checklist to verify Phase 1 is working correctly:

- [ ] Python dependencies installed without errors
- [ ] vcan0 interface is up and running
- [ ] Flask server starts successfully
- [ ] Database is initialized (autoapi.db created)
- [ ] Demo vehicle is seeded
- [ ] CAN interface initialized
- [ ] System status endpoint returns 200 OK
- [ ] Vehicle list endpoint returns demo vehicle
- [ ] Vehicle unlock generates CAN frame visible in candump
- [ ] Engine start generates CAN frame visible in candump
- [ ] Logs are being created in database

## Common Issues and Solutions

### Issue: "ModuleNotFoundError: No module named 'flask'"

**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: "Cannot find device 'vcan0'"

**Solution:**
```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

### Issue: "Permission denied" when accessing CAN

**Solution:**
```bash
sudo usermod -a -G dialout $USER
# Log out and log back in
```

### Issue: "Address already in use" (Port 5000)

**Solution:** Change the port in `app.py`:
```python
socketio.run(app, debug=True, host='0.0.0.0', port=5001)
```

### Issue: CAN frames not appearing in candump

**Solution:**
1. Verify vcan0 is up: `ip link show vcan0`
2. Check Flask console for CAN initialization messages
3. Ensure candump is running before making API calls

## Testing Complete Workflow

Run this complete test to verify the entire system:

```bash
# Terminal 1: Start candump
candump vcan0

# Terminal 2: Start Flask server
cd backend
python app.py

# Terminal 3: Run API tests
# Get system status
curl http://localhost:5000/api/system/status | jq

# Get vehicles
curl http://localhost:5000/api/vehicles | jq

# Unlock vehicle
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/unlock | jq

# Open boot
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/boot/open | jq

# Start engine
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/engine/start | jq
```

Watch Terminal 1 (candump) - you should see CAN frames for each action!

## Next Steps

Once Phase 1 is verified:

1. Explore the API endpoints
2. Review the database schema in `autoapi.db`
3. Check logs in the `logs/` directory
4. Prepare for Phase 2: Vehicle Digital Twin & Google Pixel Controller

## Support

If you encounter issues not covered here:

1. Check the main README.md
2. Review the Flask console output for error messages
3. Verify all prerequisites are installed
4. Ensure you're running on a Linux system with CAN support

---

**Phase 1 Setup Complete!** 🚀

You now have a fully functional AutoAPI-X backend with:
- ✅ REST API endpoints
- ✅ CAN frame generation
- ✅ Real-time SocketIO
- ✅ Database logging
- ✅ Modular architecture
