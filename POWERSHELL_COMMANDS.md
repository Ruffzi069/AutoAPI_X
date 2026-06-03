# PowerShell Commands for AutoAPI-X

## Quick Reference for Windows PowerShell Users

---

## 🚀 Starting the Server

```powershell
# Navigate to backend
cd backend

# Start production server
python run_production.py

# Or use start.bat
..\start.bat
```

---

## 🧪 Testing the API

### Option 1: Use PowerShell Test Script (Recommended)

```powershell
# Run the PowerShell test script
.\test_api_powershell.ps1
```

### Option 2: Manual PowerShell Commands

**System Status:**
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/system/status -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

**Get All Vehicles:**
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/vehicles -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

**Get Vehicle by VIN:**
```powershell
$VIN = "5YJ3E1EA1KF000001"
Invoke-WebRequest -Uri "http://localhost:5000/api/vehicles/$VIN" -Method GET | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

**Unlock Vehicle:**
```powershell
$VIN = "5YJ3E1EA1KF000001"
Invoke-WebRequest -Uri "http://localhost:5000/api/vehicles/$VIN/unlock" -Method POST | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

**Lock Vehicle:**
```powershell
$VIN = "5YJ3E1EA1KF000001"
Invoke-WebRequest -Uri "http://localhost:5000/api/vehicles/$VIN/lock" -Method POST | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

**Open Boot:**
```powershell
$VIN = "5YJ3E1EA1KF000001"
Invoke-WebRequest -Uri "http://localhost:5000/api/vehicles/$VIN/boot/open" -Method POST | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

**Start Engine:**
```powershell
$VIN = "5YJ3E1EA1KF000001"
Invoke-WebRequest -Uri "http://localhost:5000/api/vehicles/$VIN/engine/start" -Method POST | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

### Option 3: Use Real curl (if installed)

```powershell
# Use curl.exe to avoid PowerShell alias
curl.exe -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/unlock
curl.exe -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/lock
curl.exe -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/boot/open
curl.exe -X POST http://localhost:5000/api/vehicles/5YJ3E1EA1KF000001/engine/start
```

---

## 📊 Shorter Aliases

Create these aliases in your PowerShell profile for easier testing:

```powershell
# Add to your PowerShell profile
function Test-AutoAPI {
    .\test_api_powershell.ps1
}

function Get-VehicleStatus {
    param($VIN = "5YJ3E1EA1KF000001")
    Invoke-WebRequest -Uri "http://localhost:5000/api/vehicles/$VIN" -Method GET | 
        Select-Object -ExpandProperty Content | ConvertFrom-Json
}

function Invoke-VehicleUnlock {
    param($VIN = "5YJ3E1EA1KF000001")
    Invoke-WebRequest -Uri "http://localhost:5000/api/vehicles/$VIN/unlock" -Method POST | 
        Select-Object -ExpandProperty Content | ConvertFrom-Json
}

function Invoke-VehicleLock {
    param($VIN = "5YJ3E1EA1KF000001")
    Invoke-WebRequest -Uri "http://localhost:5000/api/vehicles/$VIN/lock" -Method POST | 
        Select-Object -ExpandProperty Content | ConvertFrom-Json
}

# Usage:
# Test-AutoAPI
# Get-VehicleStatus
# Invoke-VehicleUnlock
# Invoke-VehicleLock
```

---

## 🔍 Checking Server Status

**Check if server is running:**
```powershell
Test-NetConnection -ComputerName localhost -Port 5000
```

**Find process using port 5000:**
```powershell
Get-NetTCPConnection -LocalPort 5000 | Select-Object -Property LocalAddress, LocalPort, State, OwningProcess
```

**Kill process on port 5000:**
```powershell
# Get the PID first
$pid = (Get-NetTCPConnection -LocalPort 5000).OwningProcess
# Kill it
Stop-Process -Id $pid -Force
```

---

## 📝 Pretty Print JSON

**Install if needed:**
```powershell
# JSON is built-in, but for better formatting:
$response = Invoke-WebRequest -Uri http://localhost:5000/api/vehicles -Method GET
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Or use Format-List:**
```powershell
$response = Invoke-WebRequest -Uri http://localhost:5000/api/vehicles -Method GET
$data = $response.Content | ConvertFrom-Json
$data.vehicles | Format-List
```

---

## 🐛 Debugging

**View full response:**
```powershell
$response = Invoke-WebRequest -Uri http://localhost:5000/api/system/status -Method GET
$response | Format-List *
```

**View headers:**
```powershell
$response = Invoke-WebRequest -Uri http://localhost:5000/api/system/status -Method GET
$response.Headers
```

**View status code:**
```powershell
$response = Invoke-WebRequest -Uri http://localhost:5000/api/system/status -Method GET
$response.StatusCode
```

---

## 💡 Tips

1. **PowerShell's `curl` is NOT real curl** - It's an alias for `Invoke-WebRequest`
2. **Use `curl.exe`** if you want the real curl command
3. **Use the PowerShell test script** for easiest testing
4. **Pipe to `ConvertFrom-Json`** to parse JSON responses
5. **Use `-Method POST`** for POST requests (not `-X POST`)

---

## 🚀 Quick Test Sequence

```powershell
# 1. Start server
cd backend
python run_production.py

# 2. In new PowerShell window, run tests
cd ..
.\test_api_powershell.ps1

# 3. Or test manually
$VIN = "5YJ3E1EA1KF000001"
Invoke-WebRequest -Uri "http://localhost:5000/api/vehicles/$VIN/unlock" -Method POST | Select-Object -ExpandProperty Content | ConvertFrom-Json
```

---

## 📚 Resources

- **PowerShell Docs:** https://docs.microsoft.com/en-us/powershell/
- **Invoke-WebRequest:** https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-webrequest
- **API Documentation:** See `API_DOCUMENTATION.md`

---

*PowerShell Commands Reference - AutoAPI-X*

🚗💻✨
