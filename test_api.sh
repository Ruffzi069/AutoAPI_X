#!/bin/bash

# AutoAPI-X Phase 1 - API Test Script
# This script tests all Phase 1 API endpoints

echo "=========================================="
echo "AutoAPI-X Phase 1 - API Testing"
echo "=========================================="
echo ""

BASE_URL="http://localhost:5000"
VIN="5YJ3E1EA1KF000001"

echo "Test 1: System Status"
echo "GET $BASE_URL/api/system/status"
curl -s $BASE_URL/api/system/status | python3 -m json.tool
echo ""
echo ""

echo "Test 2: Get All Vehicles"
echo "GET $BASE_URL/api/vehicles"
curl -s $BASE_URL/api/vehicles | python3 -m json.tool
echo ""
echo ""

echo "Test 3: Get Specific Vehicle"
echo "GET $BASE_URL/api/vehicles/$VIN"
curl -s $BASE_URL/api/vehicles/$VIN | python3 -m json.tool
echo ""
echo ""

echo "Test 4: Lock Vehicle"
echo "POST $BASE_URL/api/vehicles/$VIN/lock"
curl -s -X POST $BASE_URL/api/vehicles/$VIN/lock | python3 -m json.tool
echo ""
echo ""

echo "Test 5: Unlock Vehicle"
echo "POST $BASE_URL/api/vehicles/$VIN/unlock"
curl -s -X POST $BASE_URL/api/vehicles/$VIN/unlock | python3 -m json.tool
echo ""
echo ""

echo "Test 6: Open Boot"
echo "POST $BASE_URL/api/vehicles/$VIN/boot/open"
curl -s -X POST $BASE_URL/api/vehicles/$VIN/boot/open | python3 -m json.tool
echo ""
echo ""

echo "Test 7: Start Engine"
echo "POST $BASE_URL/api/vehicles/$VIN/engine/start"
curl -s -X POST $BASE_URL/api/vehicles/$VIN/engine/start | python3 -m json.tool
echo ""
echo ""

echo "=========================================="
echo "Testing Complete!"
echo "=========================================="
echo ""
echo "Check your candump terminal for CAN frames!"
echo ""
