# AutoAPI-X - Quick Start Guide

## 🚀 Running the Platform

### Backend (Python Flask + SocketIO)
```bash
cd backend
python run.py
```
**Port**: `http://localhost:5000`  
**Status**: Backend running with CAN simulation mode (Windows)

### Frontend (React + TypeScript + Vite)
```bash
cd frontend
npm run dev
```
**Port**: `http://localhost:5173`  
**Build**: `npm run build` (production)

---

## 🗺️ Navigation Structure

### Sidebar Menu
| Icon | Module | Route | Status |
|------|--------|-------|--------|
| 🚗 | Dashboard | `/` | ✅ Complete |
| 🎵 | Infotainment Center | `/infotainment` | ✅ Complete |
| 🛡️ | Attack Center | `/attacks` | 🔜 Coming Soon |
| 📊 | Impact Analysis | `/impact-analysis` | 🔜 Coming Soon |
| 📜 | Logs Center | `/logs` | 🔜 Coming Soon |
| 🔒 | Secure Mode | `/secure-mode` | 🔜 Coming Soon |
| ⚙️ | Settings | `/settings` | 🔜 Coming Soon |

---

## 📂 Project Structure

```
AutoAPI-X/
├── backend/
│   ├── app.py                      # Main Flask app
│   ├── run.py                      # Development server
│   ├── run_production.py           # Production server
│   ├── can/
│   │   └── socketcan_manager.py    # CAN interface (14 methods)
│   ├── database/
│   │   ├── database.py             # Database manager
│   │   └── autoapi.db              # SQLite database
│   ├── models/
│   │   ├── user.py
│   │   └── vehicle.py
│   ├── routes/
│   │   ├── vehicle_routes.py       # 8 vehicle control routes
│   │   ├── media_routes.py         # 8 media routes
│   │   ├── infotainment_routes.py  # 18 infotainment routes
│   │   └── system_routes.py
│   └── services/
│       ├── vehicle_service.py      # 9 vehicle methods
│       ├── can_service.py          # 10 CAN methods
│       ├── telemetry_service.py
│       ├── media_service.py
│       ├── navigation_service.py
│       ├── weather_service.py
│       ├── ota_service.py
│       ├── phone_service.py
│       └── messaging_service.py
│
└── frontend/
    ├── src/
    │   ├── App.tsx                 # Main app with routing
    │   ├── components/
    │   │   ├── Layout/
    │   │   │   ├── AppLayout.tsx           # Sidebar navigation
    │   │   │   └── AppLayout.css
    │   │   ├── Dashboard/
    │   │   │   ├── Dashboard.tsx           # Main dashboard
    │   │   │   ├── Dashboard.css
    │   │   │   ├── MetricsBar.tsx
    │   │   │   └── LiveActivityFeed.tsx
    │   │   ├── GooglePixelController/
    │   │   ├── VehicleDigitalTwin/
    │   │   ├── VehicleInfoPanel/
    │   │   ├── Monitors/
    │   │   │   ├── APITrafficMonitor.tsx
    │   │   │   └── CANTrafficMonitor.tsx
    │   │   └── Infotainment/
    │   │       ├── SpotifyModule.tsx
    │   │       ├── MapsModule.tsx
    │   │       ├── WeatherModule.tsx
    │   │       ├── OTACenter.tsx
    │   │       ├── PhoneModule.tsx
    │   │       └── MessagesModule.tsx
    │   └── pages/
    │       ├── Infotainment.tsx    # ✅ Complete
    │       ├── AttackCenter.tsx    # 🔜 Placeholder
    │       ├── ImpactAnalysis.tsx  # 🔜 Placeholder
    │       ├── LogsCenter.tsx      # 🔜 Placeholder
    │       ├── SecureMode.tsx      # 🔜 Placeholder
    │       └── Settings.tsx        # 🔜 Placeholder
    │
    └── package.json
```

---

## 🎯 Key Features

### Phase 3: Transaction ID System ✅
- **Transaction Format**: `TXN-XXXXXXXX` (8 hex chars)
- **Coverage**: 100% of vehicle actions
- **Correlation**: API logs ↔ CAN logs ↔ Event logs
- **Methods Updated**: 27 total (9 vehicle + 10 CAN + 8 routes)

### Phase 4: Infotainment Ecosystem ✅
- **Modules**: 7 (Spotify, YouTube, Maps, Weather, OTA, Phone, Messages)
- **API Endpoints**: 26 total
- **CAN Integration**: Infotainment ECU (0x400), GPS ECU (0x327)
- **Telemetry**: Full tracking of all interactions

### Navigation Redesign ✅
- **Professional Sidebar**: 260px collapsible to 80px
- **7 Navigation Items**: Dashboard + 6 future modules
- **Compact Dashboard**: 25% size reduction
- **Scalable Architecture**: Unlimited future modules

---

## 🔌 API Endpoints

### Vehicle Control (8 endpoints)
```
POST /api/vehicle/lock
POST /api/vehicle/unlock
POST /api/vehicle/engine/start
POST /api/vehicle/engine/stop
POST /api/vehicle/climate/set
POST /api/vehicle/lights/set
POST /api/vehicle/windows/set
GET  /api/vehicle/status
```

### Media Control (8 endpoints)
```
POST /api/media/play
POST /api/media/pause
POST /api/media/next
POST /api/media/previous
POST /api/media/volume/up
POST /api/media/volume/down
POST /api/media/track
GET  /api/media/status
```

### Infotainment (18 endpoints)
```
GET  /api/navigation/location
POST /api/navigation/destination
GET  /api/navigation/route
GET  /api/weather/current
POST /api/ota/check
POST /api/ota/download
POST /api/ota/install
GET  /api/ota/status
POST /api/phone/connect
GET  /api/phone/status
POST /api/messages/sync
GET  /api/messages/list
... (and more)
```

---

## 🗄️ Database Schema

### Tables
- `users` - User accounts
- `vehicles` - Vehicle profiles
- `api_logs` - API request logs (with transaction_id)
- `can_logs` - CAN bus traffic (with transaction_id)
- `event_logs` - System events (with transaction_id)
- `can_traffic` - Real-time CAN monitoring

### Transaction ID Correlation
```sql
SELECT 
  a.transaction_id,
  a.endpoint,
  c.can_id,
  c.data,
  e.event_type
FROM api_logs a
LEFT JOIN can_logs c ON a.transaction_id = c.transaction_id
LEFT JOIN event_logs e ON a.transaction_id = e.transaction_id
WHERE a.transaction_id = 'TXN-XXXXXXXX';
```

---

## 🎨 Design System

### Colors
```css
/* Primary Purple Gradient */
--primary-start: #6D28D9;
--primary-end: #A855F7;

/* Background */
--bg-dark: #0F0F14;
--bg-card: rgba(26, 26, 36, 0.6);

/* Borders */
--border-default: rgba(109, 40, 217, 0.2);
--border-hover: rgba(109, 40, 217, 0.4);

/* Status Colors */
--success: #10B981;
--warning: #F59E0B;
--danger: #EF4444;
--info: #3B82F6;
```

### Typography
- **Font**: Inter (400, 500, 600, 700, 800)
- **Monospace**: JetBrains Mono

---

## 🔧 Technology Stack

### Backend
- **Framework**: Flask 2.3.2
- **WebSocket**: Flask-SocketIO 5.3.4
- **Database**: SQLite
- **CAN Interface**: python-can 4.2.2

### Frontend
- **Framework**: React 19.1.0
- **Language**: TypeScript 5.7.3
- **Build Tool**: Vite 8.0.16
- **Router**: React Router DOM 7.1.1
- **HTTP**: Axios 1.6.8
- **WebSocket**: socket.io-client 4.7.2

---

## 📊 Current Status

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 3: Transaction IDs | ✅ Complete | 100% |
| Phase 4: Infotainment | ✅ Complete | 100% |
| Navigation Redesign | ✅ Complete | 100% |
| Phase 5: Attack Center | 🔜 Next | 0% |
| Phase 6: Impact Analysis | 🔜 Planned | 0% |
| Phase 7: Logs Center | 🔜 Planned | 0% |
| Phase 8: Secure Mode | 🔜 Planned | 0% |

---

## 🧪 Testing

### Backend Test
```bash
cd backend
python check_transactions.py
```
**Expected**: All transaction IDs correlate across tables

### Frontend Build
```bash
cd frontend
npm run build
```
**Expected**: 
- ✅ 2223 modules transformed
- ✅ ~480KB bundle size
- ✅ No TypeScript errors

---

## 📝 Documentation Files

- `SESSION_SUMMARY.md` - Overall progress summary
- `PHASE3_TRANSACTION_SYSTEM_COMPLETE.md` - Transaction ID implementation
- `TRANSACTION_SYSTEM_TEST_REPORT.md` - Test results
- `PHASE4_COMPLETE.md` - Infotainment implementation
- `NAVIGATION_LAYOUT_REDESIGN_COMPLETE.md` - Layout redesign details
- `LAYOUT_COMPARISON.md` - Before/after comparison
- `QUICK_START_GUIDE.md` - This file
- `ARCHITECTURE.md` - System architecture
- `API_DOCUMENTATION.md` - API reference

---

## 🚨 Important Notes

### Windows Compatibility
- CAN interface runs in **simulation mode** (vcan0 only exists on Linux)
- All CAN operations generate frames but don't send to real hardware
- Perfect for development and testing

### Database
- Location: `backend/database/autoapi.db`
- **Do not delete** unless schema changes are needed
- Contains all transaction history

### Transaction IDs
- Format: `TXN-` + 8 hex characters
- Generated for EVERY vehicle action
- Flows through: API → Service → CAN → Logs

---

## 🎯 Next Development Phase

### Phase 5: Attack Center
**Objective**: Build automotive cybersecurity attack simulation platform

**Features**:
- CAN message injection
- Replay attacks
- ECU spoofing
- DoS attacks
- Attack scenario library
- Real-time execution monitoring

**Integration**:
- All attacks generate transaction IDs
- Impact tracked in Impact Analysis module
- Logs captured in Logs Center
- Security events trigger Secure Mode alerts

---

**AutoAPI-X**: Professional automotive cybersecurity platform  
**Version**: Phase 4 Complete  
**Status**: Ready for Phase 5 development
