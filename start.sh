#!/bin/bash

# AutoAPI-X Phase 1 - Quick Start Script

echo "============================================================"
echo "  AutoAPI-X - Connected Vehicle API Security Platform"
echo "  Phase 1: Backend Foundation"
echo "============================================================"
echo ""

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "⚠️  Warning: This script is designed for Linux systems."
    echo "   CAN functionality requires Linux with SocketCAN support."
    echo ""
fi

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python 3 found: $(python3 --version)"

# Check if vcan0 exists
if ip link show vcan0 &> /dev/null; then
    echo "✓ vcan0 interface is already configured"
else
    echo "⚠️  vcan0 interface not found. Setting up..."
    echo "   This requires sudo privileges."
    
    sudo modprobe vcan
    sudo ip link add dev vcan0 type vcan
    sudo ip link set up vcan0
    
    if ip link show vcan0 &> /dev/null; then
        echo "✓ vcan0 interface created successfully"
    else
        echo "⚠️  Could not create vcan0 interface. CAN will run in simulation mode."
    fi
fi

echo ""
echo "------------------------------------------------------------"
echo "  Installing Python dependencies..."
echo "------------------------------------------------------------"

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
pip install -q -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "============================================================"
echo "  Starting AutoAPI-X Backend Server"
echo "============================================================"
echo ""
echo "📡 API will be available at: http://localhost:5000"
echo "🔌 SocketIO enabled for real-time updates"
echo "🚗 Demo Vehicle VIN: 5YJ3E1EA1KF000001"
echo ""
echo "💡 TIP: Run 'candump vcan0' in another terminal to monitor CAN traffic"
echo "💡 TIP: Run 'python ../test_api.py' to test all endpoints"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the Flask application
python app.py
