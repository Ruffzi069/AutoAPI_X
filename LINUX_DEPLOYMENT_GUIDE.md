# AutoAPI-X - Linux Deployment Guide for Real SocketCAN

## 🎯 Objective

Deploy AutoAPI-X on Linux to enable **real SocketCAN integration** where CAN frames are transmitted to `vcan0` and observable with `candump`.

---

## ✅ Issue Resolved

**Problem:** Module `can` shadowing prevented python-can from loading  
**Solution:** Renamed `backend/can/` → `backend/can_manager/`  
**Status:** ✅ Fixed and verified on Windows (simulation mode)  
**Next:** Deploy to Linux for real SocketCAN integration

---

## 🐧 Linux Prerequisites

### System Requirements
- Linux OS (Ubuntu 20.04+, Debian 11+, RHEL 8+, or WSL2)
- Python 3.8 or higher
- sudo/root access for vcan0 setup

### Install Dependencies

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install python3 python3-pip git can-utils
```

#### RHEL/CentOS:
```bash
sudo yum install python3 python3-pip git can-utils
```

---

## 📦 Step 1: Clone Repository

```bash
git clone <repository-url>
cd AutoAPI-X
```

---

## 🔌 Step 2: Setup Virtual CAN Interface (vcan0)

### Load vcan Kernel Module
```bash
sudo modprobe vcan
```

### Create vcan0 Interface
```bash
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

### Verify vcan0 is Active
```bash
ip link show vcan0
```

**Expected output:**
```
vcan0: <NOARP,UP,LOWER_UP> mtu 72 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/can
```

### Make vcan0 Persistent (Optional)

Create `/etc/network/interfaces.d/vcan0`:
```bash
sudo nano /etc/network/interfaces.d/vcan0
```

Add:
```
auto vcan0
iface vcan0 inet manual
    pre-up /sbin/ip link add dev vcan0 type vcan
    up /sbin/ip link set vcan0 up
```

Or use systemd service:
```bash
sudo nano /etc/systemd/system/vcan0.service
```

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

Enable and start:
```bash
sudo systemctl enable vcan0.service
sudo systemctl start vcan0.service
```

---

## 🐍 Step 3: Install Python Dependencies

### Create Virtual Environment (Recommended)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### Install Requirements
```bash
pip install -r requirements.txt
```

### Verify python-can Installation
```bash
python3 -c "import can; print(f'python-can {can.__version__} installed at {can.__file__}')"
```

**Expected output:**
```
python-can 4.3.1 installed at /path/to/site-packages/can/__init__.py
```

---

## 🚀 Step 4: Start Backend

```bash
python run_production.py
```

**Expected output:**
```
============================================================
AutoAPI-X - Connected Vehicle API Security Platform
============================================================
Production server starting...
✓ CAN interface 'vcan0' initialized successfully
✓ Database initialized successfully
API endpoints available at http://localhost:5000/api
SocketIO enabled for real-time updates
============================================================

Press CTRL+C to stop the server
```

**🔑 Key Success Indicator:**
```
✓ CAN interface 'vcan0' initialized successfully
```

If you see this message, SocketCAN is working and frames will be transmitted to vcan0!

---

## 🔍 Step 5: Monitor CAN Traffic

### Open Second Terminal

```bash
candump vcan0
```

**Expected output:**
```
vcan0  321   [8]  00 00 00 00 00 00 00 00
```
(You'll see frames appear as you interact with the vehicle)

---

## 🧪 Step 6: Test Vehicle Commands

### Test Unlock Vehicle
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/unlock
```

**Expected in candump:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00
```

**Expected in backend console:**
```
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
```

### Test Lock Vehicle
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/lock
```

**Expected in candump:**
```
vcan0  321   [8]  01 00 00 00 00 00 00 00
```

### Test Horn
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/horn
```

**Expected in candump:**
```
vcan0  320   [8]  01 00 00 00 00 00 00 00
```

### Test Flash Lights
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/lights/flash
```

**Expected in candump:**
```
vcan0  322   [8]  01 00 00 00 00 00 00 00
```

### Test Start Engine
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/engine/start
```

**Expected in candump:**
```
vcan0  400   [8]  01 00 00 00 00 00 00 00
```

### Test Stop Engine
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/engine/stop
```

**Expected in candump:**
```
vcan0  400   [8]  00 00 00 00 00 00 00 00
```

### Test Locate Vehicle (GPS)
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/locate
```

**Expected in candump:**
```
vcan0  500   [8]  47 50 53 00 00 00 00 00
```

Note: `47 50 53` is ASCII for "GPS"

### Test Open Boot
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/boot/open
```

**Expected in candump:**
```
vcan0  330   [8]  01 00 00 00 00 00 00 00
```

### Test Close Boot
```bash
curl -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/boot/close
```

**Expected in candump:**
```
vcan0  330   [8]  00 00 00 00 00 00 00 00
```

---

## 🎨 Step 7: Start Frontend (Optional)

### Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Start Development Server
```bash
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Access Application
Open browser: `http://localhost:5173`

---

## 🔬 Advanced CAN Analysis

### Save CAN Traffic to Log
```bash
candump -l vcan0
```

This creates a timestamped log file: `candump-2026-06-03_220821.log`

### Replay CAN Traffic
```bash
canplayer -I candump-2026-06-03_220821.log vcan0
```

### Filter by CAN ID
```bash
# Only door commands (0x321)
candump vcan0,321:7FF

# Only horn commands (0x320)
candump vcan0,320:7FF

# Only engine commands (0x400)
candump vcan0,400:7FF
```

### Display with Timestamps
```bash
candump -ta vcan0
```

**Example output:**
```
(2026-06-03 22:08:21.351505)  vcan0  321   [8]  02 00 00 00 00 00 00 00
(2026-06-03 22:08:23.152341)  vcan0  321   [8]  01 00 00 00 00 00 00 00
(2026-06-03 22:08:25.892156)  vcan0  320   [8]  01 00 00 00 00 00 00 00
```

---

## 🛠️ Troubleshooting

### Issue: "CAN functionality will be simulated"

**Cause:** vcan0 not initialized or python-can not installed

**Solution:**
```bash
# Check if vcan0 exists
ip link show vcan0

# If not, create it
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0

# Check python-can
python3 -c "import can; print(can.__version__)"
```

### Issue: "Module 'can' has no attribute 'Bus'"

**Cause:** Local `can/` directory shadowing python-can

**Solution:** Already fixed! The directory has been renamed to `can_manager/`

**Verify fix:**
```bash
cd backend
python3 -c "import can; print(hasattr(can, 'Bus'))"
```

Should output: `True`

### Issue: "Permission denied" on vcan0

**Cause:** Insufficient permissions

**Solution:**
```bash
# Add user to dialout group
sudo usermod -a -G dialout $USER

# Logout and login again
```

Or use sudo:
```bash
sudo python run_production.py
```

### Issue: candump shows no traffic

**Possible causes:**

1. **Backend not running:** Start `python run_production.py`
2. **vcan0 down:** Run `sudo ip link set up vcan0`
3. **Wrong interface:** Check backend logs for initialization message
4. **Simulation mode active:** Check for "Running on Windows" message (should not appear on Linux)

**Debug:**
```bash
# Check vcan0 status
ip -s link show vcan0

# Check if backend is sending
# Look for "✓ CAN Frame Sent:" in backend console
```

---

## 📊 CAN Frame Reference

| Command | CAN ID | Payload | ECU | Description |
|---------|--------|---------|-----|-------------|
| Lock | 0x321 | `01 00 00 00 00 00 00 00` | Door | Lock doors |
| Unlock | 0x321 | `02 00 00 00 00 00 00 00` | Door | Unlock doors |
| Horn | 0x320 | `01 00 00 00 00 00 00 00` | Horn | Activate horn |
| Flash | 0x322 | `01 00 00 00 00 00 00 00` | Lights | Flash lights |
| Open Boot | 0x330 | `01 00 00 00 00 00 00 00` | Boot | Open boot |
| Close Boot | 0x330 | `00 00 00 00 00 00 00 00` | Boot | Close boot |
| Start Engine | 0x400 | `01 00 00 00 00 00 00 00` | Ignition | Start engine |
| Stop Engine | 0x400 | `00 00 00 00 00 00 00 00` | Ignition | Stop engine |
| Locate | 0x500 | `47 50 53 00 00 00 00 00` | GPS | GPS locate |

---

## ✅ Validation Checklist

- [ ] vcan0 interface created and UP
- [ ] python-can installed and working
- [ ] Backend starts with "✓ CAN interface 'vcan0' initialized successfully"
- [ ] candump vcan0 running in second terminal
- [ ] Unlock vehicle → See `vcan0  321   [8]  02 00 00 00 00 00 00 00`
- [ ] Lock vehicle → See `vcan0  321   [8]  01 00 00 00 00 00 00 00`
- [ ] Horn → See `vcan0  320   [8]  01 00 00 00 00 00 00 00`
- [ ] Start Engine → See `vcan0  400   [8]  01 00 00 00 00 00 00 00`
- [ ] Frontend UI shows real-time updates
- [ ] CAN Monitor UI displays transmitted frames
- [ ] API Monitor shows correlated transaction IDs

---

## 🎯 Success Criteria

✅ **Backend console shows:**
```
✓ CAN interface 'vcan0' initialized successfully
✓ CAN Frame Sent: ID=0x321 Data=0200000000000000 (API_Gateway → Door_ECU)
```

✅ **candump shows:**
```
vcan0  321   [8]  02 00 00 00 00 00 00 00
```

✅ **No simulation mode messages on Linux**

---

## 🚀 Production Deployment

### Using systemd Service

Create `/etc/systemd/system/autoapi-x.service`:
```ini
[Unit]
Description=AutoAPI-X Backend Server
After=network.target vcan0.service
Requires=vcan0.service

[Service]
Type=simple
User=autoapi
WorkingDirectory=/opt/autoapi-x/backend
Environment="PATH=/opt/autoapi-x/backend/venv/bin"
ExecStart=/opt/autoapi-x/backend/venv/bin/python run_production.py
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable autoapi-x.service
sudo systemctl start autoapi-x.service
```

Check status:
```bash
sudo systemctl status autoapi-x.service
```

View logs:
```bash
sudo journalctl -u autoapi-x.service -f
```

---

## 📝 Summary

**Issue Fixed:** Module shadowing resolved by renaming `can/` → `can_manager/`  
**Status:** ✅ Ready for Linux deployment  
**Verification:** Tested on Windows simulation mode - all CAN frames generated correctly  
**Next Step:** Deploy to Linux and verify with candump  

**When deployed on Linux:**
- SocketCAN will initialize automatically
- CAN frames will transmit to vcan0
- Observable with `candump vcan0`
- No code changes required

---

## 🔗 Related Documentation

- `SOCKETCAN_INTEGRATION_FIXED.md` - Technical details of the fix
- `CAN_INTEGRATION_STATUS.md` - Original integration documentation
- `API_DOCUMENTATION.md` - Complete API reference

---

**Status: ✅ READY FOR LINUX DEPLOYMENT**
