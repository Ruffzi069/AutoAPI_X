# Vehicle Architecture Module - Complete Implementation

**Status:** ✅ Complete  
**Date:** June 3, 2026  
**Build:** 554.39 KB (157.40 KB gzipped)  
**TypeScript:** 0 errors

---

## Overview

The Vehicle Architecture page has been created as the **technical foundation of AutoAPI-X**, replacing the Settings page. The module makes the **Tesla Model 3 digital twin the hero element**, with components overlaid at their physical locations.

---

## Navigation Update

**Final Sidebar Navigation:**
1. Dashboard
2. **Vehicle Architecture** (NEW - replaces Settings)
3. Infotainment Center
4. Attack Simulation
5. Impact Analysis

---

## Page Layout

```
┌─────────────────────────────────────────────────────────┐
│ Vehicle Architecture Header                             │
└─────────────────────────────────────────────────────────┘

┌──────────┬──────────────────────────────┬───────────────┐
│ Component│   LARGE VEHICLE DIGITAL TWIN │  Component    │
│ Explorer │   (Hero Element)             │  Info Panel   │
│          │   with Component Overlays    │               │
│          │                               │               │
└──────────┴──────────────────────────────┴───────────────┘

┌────────────────────────┬──────────────────────────────────┐
│ Communication Flow     │  Architecture Insights           │
│ (Secondary/Supporting) │                                   │
└────────────────────────┴──────────────────────────────────┘
```

---

## Key Design Changes

### 1. Vehicle-Centric Design
✅ **Tesla Model 3 digital twin** is now the primary visual element  
✅ Components are overlaid at **physical locations** on the vehicle  
✅ Architecture diagram is **secondary/supporting** information  
✅ User immediately sees **where** components exist on the vehicle

### 2. Component Physical Locations

Components mapped to realistic positions:

**Front Section:**
- GPS Module (roof, front)

**Dashboard Area:**
- Infotainment ECU (center console)
- OTA Module (near infotainment)

**Center Vehicle:**
- Gateway ECU (central hub)
- Body Control Module (body systems)

**Doors:**
- Door Control ECU

**Rear Section:**
- Telematics Control Unit (connectivity)

**Network Layer:**
- CAN Network (chassis level)

**External (Left Side):**
- Mobile App
- API Gateway
- Cloud Backend

### 3. Visual Component Markers

Each component on the vehicle has:
- **Circular highlight area** (20px radius)
- **Icon background** (10px radius with border)
- **Indicator dot** (4px, colored by status)
- **Label callout** (above component)
- **Dashed connection line**

**Colors:**
- Normal: `#8B5CF6` (Purple)
- Attack Impact: `#EF4444` (Red)

---

## Components Created

### Main Page
**File:** `VehicleArchitecture.tsx`  
- Main page component
- 12 vehicle components defined with:
  - Physical positions
  - Related attacks
  - Risk levels
  - Connected systems
- Auto-selects first component on load
- Integrates with attack store

### Component Explorer (Left Panel)
**File:** `ComponentExplorer.tsx`  
- Lists all 12 vehicle components
- Shows component type badge
- Risk indicator dot
- Highlights affected components during attacks
- Click to select and view details

### Architecture Diagram (Center - Hero)
**File:** `ArchitectureDiagram.tsx`  
**Key Features:**
- Large Tesla Model 3 side profile
- Component markers at physical locations
- Interactive component selection
- Attack impact highlighting
- External components (Mobile/API/Cloud) on left side
- Connection lines from cloud to vehicle
- Professional engineering aesthetic
- No blinking/pulsing animations

**Component Overlays:**
8 on-vehicle components + 3 external components

### Component Info Panel (Right Panel)
**File:** `ComponentInfoPanel.tsx`  
**Displays:**
- Component name and type
- Purpose description
- What it receives
- What it sends
- Connected systems
- Related attacks
- Risk level with color coding

### Communication Flow (Bottom - Secondary)
**File:** `CommunicationFlow.tsx`  
- Shows 7-step normal operation flow
- Switches to attack-specific flow when attack is active
- Step-by-step visualization
- Directional arrows between steps

### Architecture Insights (Bottom)
**File:** `ArchitectureInsights.tsx`  
- Brief educational text (4-5 lines)
- Explains connected vehicle command flow
- Links to attack simulations

---

## Vehicle Components Defined

1. **Google Pixel Mobile App** (External)
   - Type: app
   - Risk: High
   - Related Attacks: IDOR, Broken Authentication

2. **Vehicle API Gateway** (External)
   - Type: api
   - Risk: Critical
   - Related Attacks: IDOR, Broken Authentication, Rate Limiting Failure

3. **Cloud Backend** (External)
   - Type: cloud
   - Risk: High
   - Related Attacks: Rate Limiting Failure, Excessive Data Exposure

4. **Telematics Control Unit**
   - Type: telematics
   - Risk: Critical
   - Position: (620, 160) - Rear section
   - Related Attacks: OTA Manipulation, Rate Limiting Failure

5. **Gateway ECU**
   - Type: gateway
   - Risk: Critical
   - Position: (400, 180) - Center vehicle
   - Related Attacks: IDOR, Replay Attack, Broken Authentication

6. **GPS Module**
   - Type: ecu
   - Risk: High
   - Position: (420, 80) - Front roof
   - Related Attacks: IDOR, Excessive Data Exposure

7. **Body Control Module**
   - Type: ecu
   - Risk: Medium
   - Position: (340, 160) - Center left
   - Related Attacks: Broken Authentication, Rate Limiting Failure

8. **Infotainment ECU**
   - Type: ecu
   - Risk: High
   - Position: (460, 140) - Dashboard
   - Related Attacks: OTA Manipulation, Broken Authentication

9. **Door Control ECU**
   - Type: ecu
   - Risk: Critical
   - Position: (340, 200) - Door area
   - Related Attacks: IDOR, Replay Attack

10. **CAN Network**
    - Type: network
    - Risk: Critical
    - Position: (400, 250) - Lower chassis
    - Related Attacks: Replay Attack, Rate Limiting Failure

11. **OTA Service**
    - Type: service
    - Risk: Critical
    - Position: (520, 120) - Near infotainment
    - Related Attacks: OTA Manipulation

12. **Telemetry Service**
    - Type: service
    - Risk: Medium
    - Position: (200, 190) - External
    - Related Attacks: Excessive Data Exposure, Rate Limiting Failure

---

## Attack Integration

The Vehicle Architecture page **automatically reflects attack impact** from any module:

### IDOR
**Affected Components:**
- Vehicle API Gateway
- Gateway ECU
- Door Control ECU
- GPS Module

**Visual:** All 4 components highlighted in red on vehicle

### Broken Authentication
**Affected Components:**
- Vehicle API Gateway
- Gateway ECU
- Body Control Module
- Infotainment ECU

### Replay Attack
**Affected Components:**
- Gateway ECU
- Door Control ECU
- CAN Network

### Excessive Data Exposure
**Affected Components:**
- GPS Module
- Telemetry Service
- Cloud Backend

### OTA Manipulation
**Affected Components:**
- OTA Service
- Telematics Control Unit
- Gateway ECU
- Infotainment ECU

### Rate Limiting Failure
**Affected Components:**
- Vehicle API Gateway
- Cloud Backend
- Telematics Control Unit
- Body Control Module

---

## Professional Design Elements

✅ **No emojis** - All icons are professional SVG graphics  
✅ **No blinking** - Smooth fade transitions only  
✅ **No pulsing** - Static or smooth animations  
✅ **Engineering aesthetic** - Clean, technical, professional  
✅ **Consistent vehicle** - Same Tesla Model 3 across all pages  
✅ **Real proportions** - Accurate sedan shape with wheels, windows, doors  
✅ **Component accuracy** - Components positioned at realistic locations

---

## User Experience Flow

1. **User opens Vehicle Architecture page**
   - Sees large Tesla Model 3 with component markers
   - Component Explorer shows all 12 components
   - First component auto-selected

2. **User clicks component on vehicle**
   - Component highlights
   - Right panel shows detailed information
   - Left panel highlights selected component

3. **Attack executes in another module**
   - Vehicle Architecture automatically updates
   - Affected components turn red
   - Attack indicator badge appears
   - Communication flow switches to attack path

4. **User understands:**
   - Where components physically exist
   - How systems connect
   - Which components are affected by attacks
   - How commands flow through the ecosystem

---

## Technical Implementation

### Files Created
- `frontend/src/pages/VehicleArchitecture.tsx` ✅
- `frontend/src/pages/VehicleArchitecture.css` ✅
- `frontend/src/components/VehicleArchitecture/ComponentExplorer.tsx` ✅
- `frontend/src/components/VehicleArchitecture/ComponentExplorer.css` ✅
- `frontend/src/components/VehicleArchitecture/ArchitectureDiagram.tsx` ✅
- `frontend/src/components/VehicleArchitecture/ArchitectureDiagram.css` ✅
- `frontend/src/components/VehicleArchitecture/ComponentInfoPanel.tsx` ✅
- `frontend/src/components/VehicleArchitecture/ComponentInfoPanel.css` ✅
- `frontend/src/components/VehicleArchitecture/CommunicationFlow.tsx` ✅
- `frontend/src/components/VehicleArchitecture/CommunicationFlow.css` ✅
- `frontend/src/components/VehicleArchitecture/ArchitectureInsights.tsx` ✅
- `frontend/src/components/VehicleArchitecture/ArchitectureInsights.css` ✅

### Files Updated
- `frontend/src/App.tsx` ✅ (Replaced Settings route with Vehicle Architecture)
- `frontend/src/components/Layout/AppLayout.tsx` ✅ (Updated navigation menu)

### Integration
- Uses `attackStore` from Zustand for attack state
- Shares `AttackExecution` type with Impact Analysis
- Automatically updates when attacks execute

---

## Key Questions Answered

The Vehicle Architecture page answers:

✅ **Where do components physically exist?**  
Components are overlaid at realistic locations on the vehicle

✅ **What does each component do?**  
Component Info Panel explains purpose, inputs, outputs

✅ **How do APIs reach the vehicle?**  
Communication Flow shows Mobile App → API → Cloud → TCU → Gateway ECU path

✅ **How do attacks affect vehicle systems?**  
Affected components highlight in red automatically

✅ **How does the connected vehicle ecosystem operate?**  
Visual diagram shows all connections and command flow

---

## Design Philosophy

**Resembles:**
- Tesla Vehicle Systems Explorer ✅
- OEM Engineering Console ✅
- Automotive Network Visualization Platform ✅
- Connected Vehicle Architecture Viewer ✅

**Avoids:**
- IT Network Diagram ❌
- Generic Flow Chart ❌
- Settings Page ❌
- Traditional Dashboard ❌
- Gaming UI ❌
- Cyberpunk Aesthetics ❌

---

## Color Scheme

**Component States:**
- Normal: `#8B5CF6` (Purple)
- Attack Impact: `#EF4444` (Red)
- External Systems: `#8B5CF6` (Purple)
- ECUs: `#F59E0B` (Amber)
- Telematics: `#3B82F6` (Blue)
- Services: `#A855F7` (Light Purple)

**Risk Levels:**
- Critical: `#EF4444` (Red)
- High: `#F59E0B` (Orange)
- Medium: `#FBBF24` (Yellow)
- Low: `#10B981` (Green)

---

## Responsive Design

**Desktop (1400px+):**
- Three-column layout: Explorer + Vehicle + Info Panel
- Two-column bottom: Communication Flow + Insights

**Tablet/Mobile (<1400px):**
- Single column layout
- All components stack vertically
- Vehicle remains large and centered

---

## Build Output

```
dist/assets/index-BpcHNVyE.css   66.43 kB │ gzip:  10.51 kB
dist/assets/index-Ct3iQb4U.js   554.39 kB │ gzip: 157.40 kB
```

**TypeScript Errors:** 0  
**Build Time:** 705ms  
**Status:** ✅ Production Ready

---

## Success Criteria

✅ **Vehicle is the hero element**  
✅ **Components at physical locations**  
✅ **Professional engineering aesthetic**  
✅ **No emojis, no blinking, no pulsing**  
✅ **Tesla Model 3 consistency across platform**  
✅ **Attack integration functional**  
✅ **Interactive component selection**  
✅ **Clear component information**  
✅ **Supporting architecture diagram**  
✅ **Educational insights included**

---

## Summary

The Vehicle Architecture page successfully replaces the Settings page and becomes the **technical foundation of AutoAPI-X**. The page makes the **Tesla Model 3 digital twin the centerpiece**, with components overlaid at their physical locations.

When a judge, professor, researcher, or engineer opens this page, they immediately understand:
- Where vehicle components physically exist
- What each component does
- How APIs reach the vehicle
- How attacks affect different vehicle systems
- How the connected vehicle ecosystem operates

The page feels like a **Tesla Vehicle Systems Explorer** or **OEM Engineering Interface** rather than a generic settings page or IT diagram.

**The Vehicle Architecture module implementation is complete.** ✅
