@echo off
echo ============================================================
echo AutoAPI-X - Connected Vehicle Security Platform
echo ============================================================
echo.
echo Starting AutoAPI-X Platform...
echo.
echo [1/3] Starting Backend Server...
echo.

cd /d "%~dp0backend"
start "AutoAPI-X Backend" cmd /k "python run.py"

timeout /t 5 /nobreak >nul

echo [2/3] Backend started on http://localhost:5000
echo.
echo [3/3] Starting Frontend Dev Server...
echo.

cd /d "%~dp0frontend"
start "AutoAPI-X Frontend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo AutoAPI-X Platform Started Successfully!
echo ============================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Two terminal windows have been opened:
echo   - AutoAPI-X Backend (Flask + SocketIO)
echo   - AutoAPI-X Frontend (Vite React)
echo.
echo IMPORTANT: Keep both terminal windows open!
echo.
echo Press any key to open the dashboard in your browser...
pause >nul

start http://localhost:5173

echo.
echo Dashboard opened in browser!
echo.
echo To stop the platform:
echo   - Close both terminal windows OR
echo   - Press CTRL+C in each terminal window
echo.
echo ============================================================
pause
