# Attack Simulation - Quick Reference Card

## 🚀 Setup (30 seconds)

```bash
# Terminal 1: Backend
cd backend && python run_production.py

# Terminal 2: CAN Monitor
candump vcan0
```

---

## 📋 Attack Commands

### 1. Replay Attack
```bash
curl -X POST http://localhost:5000/api/attacks/replay \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001","iterations":5}'
```
**candump:** 5x `vcan0  321   [8]  02 00 00 00 00 00 00 00`

---

### 2. IDOR
```bash
curl -X POST http://localhost:5000/api/attacks/idor \
  -H "Content-Type: application/json" \
  -d '{"victim_vin":"5YJ3E1EA1KF000001","attacker_vin":"ATTACKER"}'
```
**candump:** `0x321` → `0x500` → `0x330`

---

### 3. Broken Authentication
```bash
curl -X POST http://localhost:5000/api/attacks/broken-authentication \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001"}'
```
**candump:** `0x321` → `0x320` → `0x322` → `0x400`

---

### 4. Excessive Data Exposure
```bash
curl -X POST http://localhost:5000/api/attacks/excessive-data-exposure \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001"}'
```
**candump:** Multiple `0x500` (GPS queries)

---

### 5. Rate Limiting Failure
```bash
curl -X POST http://localhost:5000/api/attacks/rate-limiting-failure \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001","burst_count":30}'
```
**candump:** 30 frames, rapid burst

---

### 6. OTA Manipulation
```bash
curl -X POST http://localhost:5000/api/attacks/ota-manipulation \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001"}'
```
**candump:** `0x700` sequence → `0x600` (firmware)

---

## 🎯 One-Liner Test All

```bash
for attack in replay idor broken-authentication excessive-data-exposure rate-limiting-failure ota-manipulation; do
  echo "Testing $attack..."
  curl -s -X POST http://localhost:5000/api/attacks/$attack \
    -H "Content-Type: application/json" \
    -d '{"vin":"5YJ3E1EA1KF000001"}' | jq .message
  sleep 3
done
```

---

## ✅ Success Indicators

1. Backend console shows: `✓ CAN Frame Sent: ID=0xXXX`
2. candump shows: `vcan0  XXX   [8]  ...`
3. Frames match expected CAN IDs
4. Timing is progressive (not instant)

---

## 🔍 Troubleshooting

**No CAN traffic?**
```bash
# Check vcan0
ip link show vcan0 | grep UP

# Check backend
grep "CAN interface" backend_logs

# Restart if needed
sudo ip link set up vcan0
```

---

## 📊 Expected Frame Counts

| Attack | Frames | Duration |
|--------|--------|----------|
| Replay | 5 | 1s |
| IDOR | 3 | 0.5s |
| Broken Auth | 4 | 0.6s |
| Data Exposure | 5 | 0.8s |
| Rate Limiting | 30 | 2-4s |
| OTA | 5 | 1.5s |

---

## 🎓 Demo Script

```bash
# 1. Show empty candump
candump vcan0

# 2. Execute attack
curl -X POST http://localhost:5000/api/attacks/replay \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001","iterations":5}'

# 3. Point to candump showing frames
# "These are actual CAN frames transmitted to vcan0"

# 4. Show timestamped output
candump -ta vcan0

# 5. Execute rate limiting attack
curl -X POST http://localhost:5000/api/attacks/rate-limiting-failure \
  -H "Content-Type: application/json" \
  -d '{"vin":"5YJ3E1EA1KF000001","burst_count":30}'

# 6. "Notice the burst traffic pattern"
```

---

**Status:** Ready for Linux testing  
**Platform:** Requires vcan0 (Linux only)  
**Observable:** candump vcan0
