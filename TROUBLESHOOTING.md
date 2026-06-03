# AutoAPI-X - Troubleshooting Guide

## Common Issues and Solutions

---

## Issue: Port 5000 Already in Use

### Error Message
```
OSError: [WinError 10048] Only one usage of each socket address 
(protocol/network address/port) is normally permitted
```

### Cause
- Port 5000 is already being used by another process
- Flask debug mode with reloader trying to bind twice
- Previous server instance still running

### Solutions

#### Solution 1: Use Production Runner (Recommended)
```bash
cd backend
python run_production.py
```

This runs without debug mode and avoids the reloader issue.

#### Solution 2: Kill Existing Process

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

#### Solution 3: Use Different Port

Edit `backend/app.py` or `backend/run.py`:
```python
socketio.run(app, debug=True, host='0.0.0.0', port=5001)
```

Then access at: `http://localhost:5001`

#### Solution 4: Disable Debug Mode

Edit `backend/app.py`:
```python
socketio.run(app, debug=False, host='0.0.0.0', port=5000)
```

---

## Issue: Module Not Found

### Error Message
```
ModuleNotFoundError: No module named 'flask'
```

### Solution
```bash
cd backend
pip install -r requirements.txt
```

---

## Issue: CAN Interface Not Found

### Error Message
```
Warning: Could not initialize CAN interface 'vcan0'
```

### Cause
This is expected on Windows. CAN functionality requires Linux.

### Solution
**On Windows:** CAN frames are simulated. API works normally.

**On Linux:** Setup vcan0:
```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

---

## Issue: Database Locked

### Error Message
```
sqlite3.OperationalError: database is locked
```

### Solution
```bash
# Close all connections to the database
# Delete the database file and restart
cd backend/database
del autoapi.db  # Windows
rm autoapi.db   # Linux/Mac

# Restart the server (database will be recreated)
cd ..
python app.py
```

---

## Issue: CORS Errors in Browser

### Error Message
```
Access to XMLHttpRequest blocked by CORS policy
```

### Solution
CORS is already enabled in `app.py`. If still seeing errors:

1. Check that Flask-CORS is installed:
```bash
pip install flask-cors
```

2. Verify CORS configuration in `app.py`:
```python
CORS(app)  # Should be present
```

3. Clear browser cache and try again

---

## Issue: SocketIO Connection Failed

### Error Message (in browser console)
```
WebSocket connection failed
```

### Solution

1. Verify server is running:
```bash
curl http://localhost:5000/api/system/status
```

2. Check SocketIO is initialized:
```python
# In app.py
socketio = SocketIO(app, cors_allowed_origins="*")
```

3. Use correct SocketIO client version:
```bash
npm install socket.io-client@4
```

---

## Issue: Import Errors

### Error Message
```
ImportError: cannot import name 'X' from 'Y'
```

### Solution

1. Check Python path:
```bash
cd backend
python -c "import sys; print(sys.path)"
```

2. Ensure `__init__.py` files exist in all directories

3. Run from correct directory:
```bash
cd backend
python app.py
```

---

## Issue: Slow Performance

### Symptoms
- API responses take > 1 second
- High CPU usage
- Memory leaks

### Solutions

1. **Disable Debug Mode:**
```python
socketio.run(app, debug=False, ...)
```

2. **Use Production Server:**
```bash
python run_production.py
```

3. **Check Database Size:**
```bash
# If logs table is too large, clear old logs
sqlite3 backend/database/autoapi.db
DELETE FROM api_logs WHERE timestamp < datetime('now', '-7 days');
DELETE FROM can_logs WHERE timestamp < datetime('now', '-7 days');
DELETE FROM event_logs WHERE timestamp < datetime('now', '-7 days');
.quit
```

---

## Issue: Tests Failing

### Error Message
```
Connection refused / Server not responding
```

### Solution

1. **Start server first:**
```bash
cd backend
python run_production.py
```

2. **Then run tests in new terminal:**
```bash
python test_api.py
```

3. **Check server URL in tests:**
```python
BASE_URL = "http://localhost:5000"  # Should match server port
```

---

## Issue: Virtual Environment Issues

### Error Message
```
'python' is not recognized as an internal or external command
```

### Solution

**Windows:**
```bash
# Create venv
python -m venv venv

# Activate
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Linux/Mac:**
```bash
# Create venv
python3 -m venv venv

# Activate
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## Issue: Permission Denied (Linux)

### Error Message
```
PermissionError: [Errno 13] Permission denied
```

### Solution

1. **For CAN interface:**
```bash
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

2. **For file permissions:**
```bash
chmod +x start.sh
chmod +x test_api.py
```

3. **For port < 1024:**
```bash
# Use port >= 1024 (like 5000)
# Or run with sudo (not recommended)
```

---

## Issue: Eventlet Warnings

### Warning Message
```
WARNING: Eventlet is not installed. Using threading mode.
```

### Solution
```bash
pip install eventlet
```

Or ignore - threading mode works fine for development.

---

## Quick Diagnostic Commands

### Check Server Status
```bash
curl http://localhost:5000/api/system/status
```

### Check Port Usage
```bash
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000
```

### Check Python Version
```bash
python --version  # Should be 3.8+
```

### Check Installed Packages
```bash
pip list | grep -i flask
pip list | grep -i socketio
```

### Check Database
```bash
cd backend/database
sqlite3 autoapi.db
.tables
SELECT COUNT(*) FROM vehicles;
.quit
```

---

## Getting Help

If issues persist:

1. Check the logs in `backend/logs/`
2. Review `README.md` for setup instructions
3. Check `SETUP_INSTRUCTIONS.md` for detailed guide
4. Verify all prerequisites are installed
5. Try running in production mode: `python run_production.py`

---

## Prevention Tips

1. **Always activate virtual environment** before running
2. **Use production runner** to avoid debug mode issues
3. **Check port availability** before starting server
4. **Keep dependencies updated:** `pip install -r requirements.txt --upgrade`
5. **Clear old logs** periodically to maintain performance

---

*AutoAPI-X Troubleshooting Guide*  
*Updated: June 2, 2026*

🔧🚗✅
