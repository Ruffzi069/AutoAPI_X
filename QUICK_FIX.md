# Quick Fix - Port 5000 Already in Use

## ⚡ Immediate Solution

You're seeing this error because Flask's debug mode is trying to start the server twice.

### Option 1: Use Production Runner (Easiest)

```bash
cd backend
python run_production.py
```

This runs without debug mode and avoids the port conflict.

### Option 2: Kill Existing Process

**Windows:**
```bash
# Find the process
netstat -ano | findstr :5000

# Kill it (replace 1234 with actual PID from above)
taskkill /PID 1234 /F

# Then restart
cd backend
python app.py
```

### Option 3: Use Different Port

Edit `backend/app.py`, change the last line to:
```python
socketio.run(app, debug=True, host='0.0.0.0', port=5001, allow_unsafe_werkzeug=True)
```

Then access at `http://localhost:5001`

---

## ✅ What I Fixed

I've updated your code to:

1. **Added `allow_unsafe_werkzeug=True`** to `app.py` - This fixes the eventlet warning
2. **Created `run_production.py`** - A production runner without debug mode
3. **Created `run.py`** - An alternative runner with better configuration
4. **Updated `start.bat`** - Now uses production runner by default

---

## 🚀 Recommended Approach

**For Development:**
```bash
cd backend
python run_production.py
```

**For Testing:**
```bash
# Terminal 1: Start server
cd backend
python run_production.py

# Terminal 2: Run tests
python test_api.py
```

---

## 📝 Files Created/Updated

- ✅ `backend/app.py` - Added `allow_unsafe_werkzeug=True`
- ✅ `backend/run.py` - New development runner
- ✅ `backend/run_production.py` - New production runner
- ✅ `start.bat` - Updated to use production runner
- ✅ `TROUBLESHOOTING.md` - Complete troubleshooting guide
- ✅ `QUICK_FIX.md` - This file

---

## 🎯 Try This Now

```bash
cd backend
python run_production.py
```

The server should start without errors! 🎉

---

*Quick Fix Guide - AutoAPI-X*
