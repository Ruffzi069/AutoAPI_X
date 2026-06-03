#!/bin/bash

#############################################################
# AutoAPI-X Demo Startup Script
# Starts all components for demonstration
#############################################################

echo "🚀 AutoAPI-X - Starting Demo Environment"
echo "=========================================="
echo

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo -e "${RED}❌ This script requires Linux with SocketCAN support${NC}"
    echo "   Current OS: $OSTYPE"
    exit 1
fi

echo "✓ Running on Linux"

# Check if vcan0 exists
if ! ip link show vcan0 &>/dev/null; then
    echo -e "${YELLOW}⚠ vcan0 not found, creating...${NC}"
    
    # Load vcan module
    sudo modprobe vcan
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to load vcan module${NC}"
        exit 1
    fi
    
    # Create vcan0
    sudo ip link add dev vcan0 type vcan
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to create vcan0${NC}"
        exit 1
    fi
    
    echo "✓ vcan0 created"
fi

# Bring vcan0 up
sudo ip link set up vcan0
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to bring vcan0 up${NC}"
    exit 1
fi

# Verify vcan0 is UP
if ip link show vcan0 | grep -q "UP"; then
    echo -e "${GREEN}✓ vcan0 is UP${NC}"
else
    echo -e "${RED}❌ vcan0 is not UP${NC}"
    exit 1
fi

echo

# Check dependencies
echo "Checking dependencies..."

# Check Python
if ! command -v python3 &>/dev/null; then
    echo -e "${RED}❌ Python 3 not found${NC}"
    exit 1
fi
echo "✓ Python 3 found"

# Check Node.js
if ! command -v node &>/dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi
echo "✓ Node.js found"

# Check candump
if ! command -v candump &>/dev/null; then
    echo -e "${YELLOW}⚠ candump not found (install can-utils)${NC}"
    echo "   Run: sudo apt install can-utils"
else
    echo "✓ candump found"
fi

echo

# Start backend
echo "=========================================="
echo "Starting Backend Server..."
echo "=========================================="
cd backend

# Check if virtual env exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv and install dependencies
source venv/bin/activate
pip install -q -r requirements.txt

# Start backend in background
python run_production.py &
BACKEND_PID=$!

echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo "  Waiting for backend to initialize..."
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Backend failed to start${NC}"
    exit 1
fi

# Test backend
if curl -s http://localhost:5000/api/system/status &>/dev/null; then
    echo -e "${GREEN}✓ Backend responding on http://localhost:5000${NC}"
else
    echo -e "${YELLOW}⚠ Backend not responding yet (may still be starting)${NC}"
fi

cd ..
echo

# Start frontend
echo "=========================================="
echo "Starting Frontend Server..."
echo "=========================================="
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start frontend in background
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "  Waiting for frontend to initialize..."
sleep 5

cd ..
echo

# Summary
echo "=========================================="
echo -e "${GREEN}✅ AutoAPI-X Demo Environment Ready${NC}"
echo "=========================================="
echo
echo "🌐 Frontend:  http://localhost:5173"
echo "🔧 Backend:   http://localhost:5000"
echo "📡 vcan0:     Ready for CAN traffic"
echo
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo
echo "1. Open CAN monitor in a new terminal:"
echo "   ${YELLOW}candump vcan0${NC}"
echo
echo "2. Open browser:"
echo "   ${YELLOW}http://localhost:5173${NC}"
echo
echo "3. Navigate to: Attack Simulation"
echo
echo "4. Click: 'Run Attack'"
echo
echo "5. Watch candump terminal for CAN frames!"
echo
echo "=========================================="
echo "Stop Demo:"
echo "=========================================="
echo
echo "Press Ctrl+C to stop all services"
echo
echo "Or run: ${YELLOW}kill $BACKEND_PID $FRONTEND_PID${NC}"
echo

# Save PIDs to file
echo "$BACKEND_PID" > .demo_backend_pid
echo "$FRONTEND_PID" > .demo_frontend_pid

# Wait for Ctrl+C
trap cleanup EXIT

cleanup() {
    echo
    echo "=========================================="
    echo "Stopping AutoAPI-X Demo..."
    echo "=========================================="
    
    if [ -f .demo_backend_pid ]; then
        BACKEND_PID=$(cat .demo_backend_pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            echo "✓ Backend stopped"
        fi
        rm .demo_backend_pid
    fi
    
    if [ -f .demo_frontend_pid ]; then
        FRONTEND_PID=$(cat .demo_frontend_pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            echo "✓ Frontend stopped"
        fi
        rm .demo_frontend_pid
    fi
    
    echo "✓ Demo environment cleaned up"
    echo
}

# Keep script running
wait
