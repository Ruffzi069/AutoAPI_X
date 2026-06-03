#!/bin/bash

#############################################################
# AutoAPI-X Demo Stop Script
# Stops all running services
#############################################################

echo "🛑 Stopping AutoAPI-X Demo Environment"
echo "========================================"
echo

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Stop backend
if [ -f .demo_backend_pid ]; then
    BACKEND_PID=$(cat .demo_backend_pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo -e "${GREEN}✓ Backend stopped (PID: $BACKEND_PID)${NC}"
    else
        echo -e "${YELLOW}⚠ Backend not running${NC}"
    fi
    rm .demo_backend_pid
else
    echo -e "${YELLOW}⚠ Backend PID file not found${NC}"
fi

# Stop frontend
if [ -f .demo_frontend_pid ]; then
    FRONTEND_PID=$(cat .demo_frontend_pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✓ Frontend stopped (PID: $FRONTEND_PID)${NC}"
    else
        echo -e "${YELLOW}⚠ Frontend not running${NC}"
    fi
    rm .demo_frontend_pid
else
    echo -e "${YELLOW}⚠ Frontend PID file not found${NC}"
fi

# Clean up any other processes
echo
echo "Cleaning up..."

# Kill any remaining backend processes
pkill -f "run_production.py" 2>/dev/null && echo "✓ Cleaned up backend processes"

# Kill any remaining frontend processes
pkill -f "vite" 2>/dev/null && echo "✓ Cleaned up frontend processes"

echo
echo -e "${GREEN}✅ Demo environment stopped${NC}"
echo

# Optional: bring down vcan0
read -p "Do you want to bring down vcan0? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo ip link set down vcan0
    sudo ip link delete vcan0
    echo -e "${GREEN}✓ vcan0 removed${NC}"
fi

echo
echo "To start again, run: ./start_demo.sh"
echo
