# Linux Quick Start - SocketCAN Integration

## 🚀 Get AutoAPI-X Running on Linux in 5 Minutes

This is the fastest path from "fresh Linux system" to "real CAN frames observable with candump."

---

## Prerequisites

You need:
- Linux OS (Ubuntu/Debian/WSL2/RHEL)
- Python 3.8+
- sudo access
- 5 minutes

---

## Step 1: Setup vcan0 (1 minute)

```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
ip link show vcan0
```

**Expected output:**
```
vcan0: <NOARP,UP,LOWER_UP> ...
```

---

## Step 2: Install Dependencies (2 minutes)

```bash
cd backend
pip install -r requirements.txt
```

**Or install manually:**
```bash
pip install flask flask-socketio flask-cors python-can
```

---

## Step 3: Start Backend (30 seconds)

```bash
python run_production.py
```

**Look for:**
```
✓ CAN interface 'vcan0' initialized successfully
```

**🚨 If you see "simulation mode" instead, vcan0 isn't working!**

---

## Step 4: Test It! (1 minute)

**Terminal 1 (Backend is running)**

**Terminal 2:**
```bash
candump vcan0
```

**Terminal 3:**
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/unlock
```

**Terminal 2 should show:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00
```

**✅ If you see this, IT WORKS!**

---

## Expected vs Problem Output

### ✅ Success Looks Like

**Backend:**
```
✓ CAN interface 'vcan0' initialized successfully
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000
```

**candump:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00
```

---

### ❌ Problem Looks Like

**Backend:**
```
⚠ Warning: Could not initialize CAN interface 'vcan0'
  CAN functionality will be simulated
✓ CAN Frame [SIM]: ID=0x321 Data=02...
```

**candump:**
```
(nothing appears)
```

**Fix:** Check vcan0 setup (Step 1)

---

## Quick Test Commands

```bash
# Unlock
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/unlock

# Lock
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/lock

# Horn
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/horn

# Start Engine
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/engine/start
```

**Each command should produce a frame in candump!**

---

## Expected CAN Frames

| Command | CAN ID | Payload |
|---------|--------|---------|
| Unlock | 0x321 | `02 00 00 00 00 00 00 00` |
| Lock | 0x321 | `01 00 00 00 00 00 00 00` |
| Horn | 0x320 | `01 00 00 00 00 00 00 00` |
| Start Engine | 0x400 | `01 00 00 00 00 00 00 00` |
| Stop Engine | 0x400 | `00 00 00 00 00 00 00 00` |
| Open Boot | 0x330 | `01 00 00 00 00 00 00 00` |
| Close Boot | 0x330 | `00 00 00 00 00 00 00 00` |
| Locate | 0x500 | `47 50 53 00 00 00 00 00` |

---

## Troubleshooting One-Liners

### vcan0 not found
```bash
sudo modprobe vcan && sudo ip link add dev vcan0 type vcan && sudo ip link set up vcan0
```

### python-can not installed
```bash
pip install python-can
```

### candump not found
```bash
sudo apt install can-utils  # Ubuntu/Debian
sudo yum install can-utils  # RHEL/CentOS
```

### Backend shows simulation mode
```bash
# Check vcan0
ip link show vcan0

# If down, bring it up
sudo ip link set up vcan0

# Restart backend
```

---

## Success Checklist

- [ ] vcan0 shows `<NOARP,UP,LOWER_UP>`
- [ ] Backend shows `✓ CAN interface 'vcan0' initialized successfully`
- [ ] candump shows frames when commands are sent
- [ ] Frame IDs match expected values
- [ ] Payloads match expected values

**All checked? ✅ SUCCESS! You have real SocketCAN integration!**

---

## What's Next?

### Start Frontend (Optional)
```bash
cd ../frontend
npm install
npm run dev
```

Open browser: `http://localhost:5173`

### Make vcan0 Persistent
```bash
sudo nano /etc/systemd/system/vcan0.service
```

Paste:
```ini
[Unit]
Description=Virtual CAN interface vcan0
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

Enable:
```bash
sudo systemctl enable vcan0.service
sudo systemctl start vcan0.service
```

### Make AutoAPI-X a Service
```bash
sudo nano /etc/systemd/system/autoapi-x.service
```

Paste:
```ini
[Unit]
Description=AutoAPI-X Backend
After=network.target vcan0.service
Requires=vcan0.service

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/path/to/AutoAPI-X/backend
ExecStart=/usr/bin/python3 run_production.py
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable autoapi-x.service
sudo systemctl start autoapi-x.service
```

---

## Documentation

For detailed information, see:
- **LINUX_DEPLOYMENT_GUIDE.md** - Complete setup guide
- **WHAT_TO_EXPECT_ON_LINUX.md** - Expected behavior
- **VERIFICATION_CHECKLIST.md** - Testing checklist
- **EXECUTIVE_SUMMARY.md** - Overview

---

**Time to working SocketCAN: ~5 minutes**  
**Difficulty: Easy**  
**Result: Real CAN frames observable with candump**

**Ready? Start with Step 1! 🚀**
