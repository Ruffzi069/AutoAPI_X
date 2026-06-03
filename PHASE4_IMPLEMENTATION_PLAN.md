# Phase 4: Infotainment Center & Connected Vehicle Services - Implementation Plan

**Phase**: 4 - Infotainment Ecosystem  
**Status**: 🚧 IN PROGRESS  
**Goal**: Transform AutoAPI-X into complete connected vehicle platform  

---

## 🎯 Phase Overview

Transform AutoAPI-X from vehicle control platform → full connected vehicle ecosystem with:
- Spotify integration
- YouTube Music
- Maps/Navigation
- Weather services
- OTA updates
- Phone connectivity
- Messaging

All with complete telemetry, CAN events, and transaction tracing.

---

## 🏗️ Architecture Plan

### Backend Components

#### 1. New Services
- `services/media_service.py` - Spotify, YouTube Music
- `services/navigation_service.py` - Maps, routing, location
- `services/weather_service.py` - Weather data
- `services/ota_service.py` - Firmware updates
- `services/phone_service.py` - Phone connectivity
- `services/messaging_service.py` - Vehicle messages

#### 2. Updated Services
- `can/socketcan_manager.py` - Add Infotainment ECU (0x400)
- `services/can_service.py` - Add infotainment CAN methods
- `models/vehicle.py` - Add infotainment state fields

#### 3. New Routes
- `routes/media_routes.py` - Media control endpoints
- `routes/navigation_routes.py` - Navigation endpoints
- `routes/weather_routes.py` - Weather endpoints
- `routes/ota_routes.py` - OTA endpoints
- `routes/phone_routes.py` - Phone endpoints
- `routes/messaging_routes.py` - Messaging endpoints

#### 4. Database Schema
```sql
-- New tables
CREATE TABLE infotainment_logs (
    id, transaction_id, timestamp, service_type, action, data
)

CREATE TABLE media_logs (
    id, transaction_id, timestamp, platform, action, song, artist
)

CREATE TABLE ota_logs (
    id, transaction_id, timestamp, action, version, status
)

CREATE TABLE navigation_logs (
    id, transaction_id, timestamp, action, location, destination
)
```

### Frontend Components

#### 1. New Pages
- `pages/Infotainment.tsx` - Main infotainment center
- `pages/InfotainmentDashboard.tsx` - Overview

#### 2. New Components
```
components/Infotainment/
├── SpotifyModule.tsx
├── YouTubeMusicModule.tsx
├── MapsModule.tsx
├── WeatherModule.tsx
├── OTACenter.tsx
├── PhoneModule.tsx
├── MessagesModule.tsx
└── InfotainmentECU.tsx (for vehicle twin)
```

#### 3. Updated Components
- `VehicleDigitalTwinProfile.tsx` - Add infotainment indicators
- `App.tsx` - Add infotainment route
- `vehicle.types.ts` - Add infotainment types

#### 4. New Types
```typescript
interface MediaState {
  platform: 'spotify' | 'youtube';
  isPlaying: boolean;
  currentSong: string;
  artist: string;
  volume: number;
}

interface NavigationState {
  destination: string;
  eta: string;
  distance: number;
  isNavigating: boolean;
}

interface OTAState {
  currentVersion: string;
  availableVersion: string;
  updateStatus: string;
  downloadProgress: number;
}
```

---

## 📝 Implementation Order

### Sprint 1: Backend Foundation
1. ✅ Create implementation plan (this file)
2. Add Infotainment ECU to CAN manager
3. Create media service
4. Create navigation service
5. Create weather service
6. Create OTA service
7. Create phone service
8. Create messaging service
9. Add infotainment CAN methods
10. Create API routes for all services

### Sprint 2: Database & Telemetry
11. Update database schema
12. Create infotainment logging methods
13. Verify transaction ID flow
14. Test API endpoints
15. Verify CAN frame generation

### Sprint 3: Frontend Foundation
16. Create infotainment types
17. Create infotainment store (Zustand)
18. Create infotainment API service
19. Add infotainment route to App
20. Create InfotainmentDashboard layout

### Sprint 4: Media Modules
21. Create SpotifyModule component
22. Create YouTubeMusicModule component
23. Add media controls (play, pause, next, volume)
24. Test media API integration
25. Verify telemetry capture

### Sprint 5: Navigation & Weather
26. Create MapsModule component
27. Create WeatherModule component
28. Add location services
29. Add route planning
30. Test navigation integration

### Sprint 6: OTA & Connectivity
31. Create OTACenter component
32. Create PhoneModule component
33. Create MessagesModule component
34. Add firmware update flow
35. Test connectivity features

### Sprint 7: Vehicle Twin Integration
36. Add infotainment ECU to digital twin
37. Add media indicator animations
38. Add GPS indicator animations
39. Add connectivity indicators
40. Test twin synchronization

### Sprint 8: Polish & Testing
41. Test all infotainment features
42. Verify transaction correlation
43. Check telemetry capture (API, CAN, Events)
44. Performance testing
45. Documentation

---

## 🎨 UI Design Specifications

### Infotainment Dashboard Layout
```
┌─────────────────────────────────────────────────┐
│  ← Back to Dashboard    Infotainment Center     │
├─────────────────────────────────────────────────┤
│                                                  │
│   ┌──────────────────────────────────────────┐  │
│   │   Infotainment Display (Large Center)    │  │
│   │                                           │  │
│   │   [Active Module Content Here]           │  │
│   │   - Spotify Player                        │  │
│   │   - Maps View                             │  │
│   │   - Weather Widget                        │  │
│   │   - etc.                                  │  │
│   │                                           │  │
│   └──────────────────────────────────────────┘  │
│                                                  │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│   │🎵   │ │▶️   │ │🗺️   │ │☁️   │ │📱   │     │
│   │Music│ │Video│ │Maps │ │Weath│ │Phone│     │
│   └─────┘ └─────┘ └─────┘ └─────┘ └─────┘     │
│                                                  │
│   ┌─────┐ ┌─────┐                               │
│   │⬇️   │ │💬   │                               │
│   │OTA  │ │Msg  │                               │
│   └─────┘ └─────┘                               │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Spotify Module Design
```
┌──────────────────────────────────┐
│  🎵 Spotify                       │
├──────────────────────────────────┤
│                                   │
│   [Album Art]                     │
│                                   │
│   Blinding Lights                 │
│   The Weeknd                      │
│                                   │
│   ━━━━━━━━━━━━━━━━━━━━━━━       │
│   2:45 / 4:30                     │
│                                   │
│   ⏮️  ⏸️  ⏭️                      │
│                                   │
│   🔊 ━━━━━━━━━━━━━━ 75%          │
│                                   │
│   Status: Playing                 │
│   TXN: TXN-A1B2C3D4               │
└──────────────────────────────────┘
```

### OTA Center Design
```
┌──────────────────────────────────┐
│  ⬇️ OTA Update Center            │
├──────────────────────────────────┤
│                                   │
│   Current Version: v1.2.3         │
│   Available: v1.3.0               │
│                                   │
│   📦 New Features:                │
│   • Enhanced autopilot            │
│   • Better range estimation       │
│   • Security improvements         │
│                                   │
│   Status: Ready to Install        │
│                                   │
│   [Check for Updates]             │
│   [Download Update]               │
│   [Install Update]                │
│                                   │
│   Update History:                 │
│   v1.2.3 - 2026-05-15             │
│   v1.2.2 - 2026-04-01             │
│                                   │
└──────────────────────────────────┘
```

---

## 🔌 CAN Integration

### New CAN IDs

```python
# Infotainment ECU
INFOTAINMENT_ECU_ID = 0x400

# Media Commands
MEDIA_PLAY = [0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
MEDIA_PAUSE = [0x10, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
MEDIA_NEXT = [0x10, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
MEDIA_PREVIOUS = [0x10, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
MEDIA_VOLUME_UP = [0x10, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
MEDIA_VOLUME_DOWN = [0x10, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]

# Navigation Commands
NAV_START = [0x11, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
NAV_STOP = [0x11, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
NAV_UPDATE = [0x11, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]

# OTA Commands
OTA_CHECK = [0x12, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
OTA_DOWNLOAD = [0x12, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
OTA_INSTALL = [0x12, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]

# Phone Commands
PHONE_SYNC = [0x13, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
PHONE_DISCONNECT = [0x13, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
```

---

## 📊 API Endpoints

### Media Endpoints
```
POST /api/media/play
POST /api/media/pause
POST /api/media/next
POST /api/media/previous
POST /api/media/volume/up
POST /api/media/volume/down
GET  /api/media/status
POST /api/media/platform (spotify/youtube)
```

### Navigation Endpoints
```
GET  /api/navigation/location
POST /api/navigation/destination
GET  /api/navigation/route
POST /api/navigation/start
POST /api/navigation/stop
GET  /api/navigation/nearby/chargers
```

### Weather Endpoints
```
GET  /api/weather/current
GET  /api/weather/forecast
```

### OTA Endpoints
```
GET  /api/ota/current
GET  /api/ota/available
POST /api/ota/check
POST /api/ota/download
POST /api/ota/install
GET  /api/ota/history
```

### Phone Endpoints
```
GET  /api/phone/status
POST /api/phone/sync
POST /api/phone/disconnect
GET  /api/phone/calls
```

### Messaging Endpoints
```
GET  /api/messages/recent
GET  /api/messages/unread
POST /api/messages/sync
```

---

## ✅ Acceptance Criteria Checklist

### Backend
- [ ] Infotainment ECU added to CAN manager
- [ ] Media service implemented
- [ ] Navigation service implemented
- [ ] Weather service implemented
- [ ] OTA service implemented
- [ ] Phone service implemented
- [ ] Messaging service implemented
- [ ] All API endpoints created
- [ ] Database tables created
- [ ] Transaction IDs flow through all services
- [ ] CAN frames generated for all actions
- [ ] Telemetry captures all events

### Frontend
- [ ] Infotainment route added
- [ ] SpotifyModule component
- [ ] YouTubeMusicModule component
- [ ] MapsModule component
- [ ] WeatherModule component
- [ ] OTACenter component
- [ ] PhoneModule component
- [ ] MessagesModule component
- [ ] Infotainment dashboard layout
- [ ] Vehicle twin shows infotainment indicators
- [ ] Real-time updates working
- [ ] Professional automotive UI

### Integration
- [ ] All modules generate API requests
- [ ] All modules generate CAN events
- [ ] All activity visible in API Monitor
- [ ] All activity visible in CAN Monitor
- [ ] All activity visible in Activity Feed
- [ ] Transaction correlation working
- [ ] Metrics dashboard updated
- [ ] Database persistence verified

### Testing
- [ ] Spotify play/pause/next working
- [ ] YouTube Music working
- [ ] Maps location services working
- [ ] Weather data displaying
- [ ] OTA update flow working
- [ ] Phone connectivity working
- [ ] Messaging working
- [ ] End-to-end telemetry verified
- [ ] Performance acceptable
- [ ] No console errors

---

## 🎯 Success Criteria

Phase 4 complete when:
1. All 7 modules functional (Music, Video, Maps, Weather, OTA, Phone, Messages)
2. Complete telemetry capture (API + CAN + Events)
3. Transaction correlation maintained
4. Vehicle twin reflects infotainment state
5. Professional automotive UI/UX
6. Platform feels like modern connected EV (Tesla/Mercedes EQ level)

---

## 📅 Estimated Timeline

- Sprint 1 (Backend Foundation): 2-3 hours
- Sprint 2 (Database & Telemetry): 1 hour
- Sprint 3 (Frontend Foundation): 1-2 hours
- Sprint 4 (Media Modules): 2 hours
- Sprint 5 (Navigation & Weather): 1-2 hours
- Sprint 6 (OTA & Connectivity): 2 hours
- Sprint 7 (Vehicle Twin): 1 hour
- Sprint 8 (Polish & Testing): 1-2 hours

**Total**: 11-15 hours

---

## 🚀 Let's Begin!

Starting with Sprint 1: Backend Foundation
