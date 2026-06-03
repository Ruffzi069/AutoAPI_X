# AutoAPI-X - PowerShell API Test Script
# For Windows PowerShell users

$BaseUrl = "http://localhost:5000/api"
$VIN = "5YJ3E1EA1KF000001"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  AutoAPI-X - PowerShell API Test Script" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: System Status
Write-Host "Test 1: System Status" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/system/status" -Method GET
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ PASS - Status: $($data.status)" -ForegroundColor Green
    Write-Host "  Platform: $($data.platform)" -ForegroundColor Gray
} catch {
    Write-Host "✗ FAIL - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get All Vehicles
Write-Host "Test 2: Get All Vehicles" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/vehicles" -Method GET
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ PASS - Found $($data.count) vehicle(s)" -ForegroundColor Green
    if ($data.vehicles) {
        Write-Host "  VIN: $($data.vehicles[0].vin)" -ForegroundColor Gray
        Write-Host "  Owner: $($data.vehicles[0].owner)" -ForegroundColor Gray
        Write-Host "  Battery: $($data.vehicles[0].battery)%" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ FAIL - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get Vehicle by VIN
Write-Host "Test 3: Get Vehicle by VIN" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/vehicles/$VIN" -Method GET
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ PASS - Vehicle found" -ForegroundColor Green
    Write-Host "  Doors: $($data.vehicle.doors_status)" -ForegroundColor Gray
    Write-Host "  Engine: $($data.vehicle.engine_status)" -ForegroundColor Gray
} catch {
    Write-Host "✗ FAIL - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Unlock Vehicle
Write-Host "Test 4: Unlock Vehicle" -ForegroundColor Yellow
Write-Host "  ⚡ CAN Frame should appear: 0x321 [02 00 00 00 00 00 00 00]" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/vehicles/$VIN/unlock" -Method POST
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ PASS - $($data.message)" -ForegroundColor Green
    Write-Host "  Doors: $($data.vehicle.doors_status)" -ForegroundColor Gray
} catch {
    Write-Host "✗ FAIL - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Lock Vehicle
Write-Host "Test 5: Lock Vehicle" -ForegroundColor Yellow
Write-Host "  ⚡ CAN Frame should appear: 0x321 [01 00 00 00 00 00 00 00]" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/vehicles/$VIN/lock" -Method POST
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ PASS - $($data.message)" -ForegroundColor Green
    Write-Host "  Doors: $($data.vehicle.doors_status)" -ForegroundColor Gray
} catch {
    Write-Host "✗ FAIL - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Open Boot
Write-Host "Test 6: Open Boot" -ForegroundColor Yellow
Write-Host "  ⚡ CAN Frame should appear: 0x323 [03 00 00 00 00 00 00 00]" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/vehicles/$VIN/boot/open" -Method POST
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ PASS - $($data.message)" -ForegroundColor Green
    Write-Host "  Boot: $($data.vehicle.boot_status)" -ForegroundColor Gray
} catch {
    Write-Host "✗ FAIL - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Start Engine
Write-Host "Test 7: Start Engine" -ForegroundColor Yellow
Write-Host "  ⚡ CAN Frame should appear: 0x324 [05 00 00 00 00 00 00 00]" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/vehicles/$VIN/engine/start" -Method POST
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✓ PASS - $($data.message)" -ForegroundColor Green
    Write-Host "  Engine: $($data.vehicle.engine_status)" -ForegroundColor Gray
} catch {
    Write-Host "✗ FAIL - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Tests Complete!" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 TIP: Run 'candump vcan0' on Linux to see CAN frames" -ForegroundColor Yellow
Write-Host "💡 On Windows, CAN frames are simulated in the server logs" -ForegroundColor Yellow
