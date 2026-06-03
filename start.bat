@echo off
REM AutoAPI-X Phase 1 - Windows Start Script

echo ============================================================
echo   AutoAPI-X - Connected Vehicle API Security Platform
echo   Phase 1: Backend Foundation
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8 or higher from python.org
    pause
    exit /b 1
)

echo [OK] Python found
python --version

echo.
echo ------------------------------------------------------------
echo   Installing Python dependencies...
echo ------------------------------------------------------------

cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install requirements
pip install -q -r requirements.txt

if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed successfully

echo.
echo ============================================================
echo   Starting AutoAPI-X Backend Server
echo ============================================================
echo.
echo [INFO] API will be available at: http://localhost:5000
echo [INFO] SocketIO enabled for real-time updates
echo [INFO] Demo Vehicle VIN: 5YJ3E1EA1KF000001
echo.
echo [WARNING] CAN functionality requires Linux with SocketCAN
echo [WARNING] On Windows, CAN frames will be simulated
echo.
echo [TIP] Run 'python ..\test_api.py' in another terminal to test
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the Flask application (production mode to avoid port conflicts)
python run_production.py
