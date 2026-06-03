# AutoAPI-X - Vehicle Digital Twin Visual Mockup

**Version:** 1.0  
**Date:** June 2, 2026

---

## Visual Mockup Description

This document describes the exact visual appearance of the Vehicle Digital Twin as it should appear in the final implementation.

---

## Overall Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AutoAPI-X Dashboard                           │
│                                                                      │
├──────────────┬──────────────────────────────────┬───────────────────┤
│              │                                  │                   │
│   Google     │                                  │   Vehicle Info    │
│   Pixel      │      VEHICLE DIGITAL TWIN        │   Panel           │
│   Controller │                                  │                   │
│              │   ┌──────────────────────────┐   │   ┌─────────────┐ │
│  ┌─────────┐ │   │ 🚗 Tesla Model 3         │   │   │ Battery     │ │
│  │ 🔓 Lock │ │   │ VIN: 5YJ3E1EA1KF000001   │   │   │ 🔋 84%      │ │
│  │ 🔐 Unlock│ │   │ Owner: User A            │   │   │ ⚡ Charging │ │
│  │ 📢 Horn  │ │   │ ──────────────────────   │   │   │             │ │
│  │ 💡 Lights│ │   │ 🔋 84% | ⚡ Charging     │   │   │ Network     │ │
│  │ 🔥 Engine│ │   │ 📡 Connected | v1.2.3    │   │   │ 📡 Connected│ │
│  │ 🚪 Boot  │ │   │ 📍 GPS Active            │   │   │ v1.2.3      │ │
│  └─────────┘ │   │ ──────────────────────   │   │   │             │ │
│              │   │ 🎵 Spotify Playing       │   │   │ GPS         │ │
│              │   └──────────────────────────┘   │   │ 📍 Active   │ │
│              │                                  │   │             │ │
│              │         [VEHICLE IMAGE]          │   │ Services    │ │
│              │                                  │   │ 🎵 Spotify  │ │
│              │    /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\       │   │ 🗺️  Maps    │ │
│              │   |  ╔═══════════════╗  |      │   │             │ │
│              │   |  ║   ┌─────┐     ║  |      │   │ Logs        │ │
│              │   |  ║   │     │     ║  |      │   │ • Unlocked  │ │
│              │   |  ║   └─────┘     ║  |      │   │ • Engine on │ │
│              │   |  ╚═══════════════╝  |      │   │ • GPS track │ │
│              │   |   ◯              ◯  |      │   └─────────────┘ │
│              │    \____________________/       │                   │
│              │                                  │                   │
│              │                                  │                   │
│   (25%)      │            (50%)                 │      (25%)        │
└──────────────┴──────────────────────────────────┴───────────────────┘
```

---

## Vehicle Appearance

### Idle State (Default)

**Vehicle Body:**
- Color: Dark metallic blue-gray (#1A1A2E)
- Finish: Matte with subtle metallic sheen
- Perspective: 2.5D isometric (30° side, 20° top)
- Size: Fills 70% of center panel
- Position: Centered vertically and horizontally

**Windows:**
- Color: Translucent blue tint (rgba(56, 189, 248, 0.15))
- Windshield: Large, curved
- Side windows: Visible on both sides
- Rear window: Slightly visible

**Wheels:**
- Color: Dark gray (#2D3748)
- Style: Modern alloy wheels
- Position: All 4 wheels visible
- Size: Proportional to vehicle

**Lighting:**
- Ambient glow: Subtle purple (#6D28D9, 10% opacity)
- Shadow: Soft drop shadow beneath vehicle
- Highlights: Subtle chrome accents on edges

---

## Component States

### Doors - Locked State

**Visual:**
```
┌─────────────┐
│   ┌─────┐   │  ← Door outline glows purple
│   │  🔒 │   │  ← Lock icon appears briefly
│   └─────┘   │
└─────────────┘
```

- Door outline: #6D28D9 glow (2px stroke)
- Glow radius: 8px
- Lock icon: Appears for 1s, then fades
- Animation: 0.5s fade in

### Doors - Unlocked State

**Visual:**
```
┌─────────────┐
│   ┌─────┐   │  ← Door outline glows green
│   │  🔓 │   │  ← Unlock icon appears briefly
│   └─────┘   │
└─────────────┘
```

- Door outline: #10B981 glow (2px stroke)
- Glow radius: 8px
- Unlock icon: Appears for 1s, then fades
- Animation: 0.5s fade in, shimmer effect

### Doors - Open State

**Visual:**
```
┌─────────────┐
│  ┌─────┐    │  ← Door rotated outward
│ /      │    │  ← Interior light visible
│/       │    │
└─────────────┘
```

- Door rotation: 15° outward
- Interior light: Purple glow (#A855F7)
- Animation: 0.8s ease-out
- Door edge: Highlighted

### Trunk - Open State

**Visual:**
```
      ╱╲        ← Trunk lid raised
     ╱  ╲
    ╱____╲
   │      │
   │      │
```

- Trunk rotation: 45° upward
- Interior cargo light: Purple glow
- Animation: 1s ease-out
- Trunk edge: #A855F7 highlight

### Headlights - On State

**Visual:**
```
  ◉ ═══════>    ← Light beam projection
  ◉ ═══════>
```

- Headlight glow: Bright white (#F8FAFC)
- Glow radius: 20px
- Light beam: Optional cone projection
- Animation: 0.3s fade in

### Headlights - Flashing State

**Visual:**
```
  ◉ ═══>       ← Pulsing effect
  ◉ ═══>
  (pulse)
```

- Pulse interval: 0.5s
- Opacity: 0.3 → 1.0 → 0.3
- Infinite loop while active

### Horn - Active State

**Visual:**
```
     )))
    )))
   )))
  [CAR]         ← Sound waves emanating
   )))
    )))
     )))
```

- Concentric circles: 3 waves
- Color: #F59E0B with fade
- Expansion: 1.0x → 2.5x scale
- Duration: 1.5s per wave
- Opacity: 0.8 → 0

### Battery - Charging State

**Visual:**
```
┌──────────┐
│ 🔋 84%   │
│ ⚡ ═══>  │  ← Animated lightning bolt
└──────────┘
```

- Lightning bolt: #38BDF8
- Pulse effect on battery icon
- Percentage: Incrementing animation
- Glow: Blue pulse around indicator

### GPS - Tracking State

**Visual:**
```
    📍
   ( )        ← Beacon rings
  (   )
 (     )
[VEHICLE]
```

- Beacon rings: Expanding circles
- Color: #38BDF8
- Pulse interval: 2s
- Opacity: 1.0 → 0

### Network - Connected State

**Visual:**
```
┌──────────┐
│ 📡 ▂▄▆█  │  ← Signal bars (4/4)
│ Connected│
└──────────┘
```

- Signal bars: #10B981 (green)
- All 4 bars filled
- Subtle pulse effect

### Network - Under Attack State

**Visual:**
```
┌──────────┐
│ ⚠️ ▂▄▆█  │  ← Red pulsing bars
│ ATTACK!  │
└──────────┘
```

- Signal bars: #EF4444 (red)
- Warning icon overlay
- Rapid pulse animation
- Alert border around vehicle

---

## Security Event Visualizations

### IDOR Attack

**Visual:**
```
╔═══════════════════════════╗
║  ⚠️ UNAUTHORIZED ACCESS   ║
║                           ║
║      [VEHICLE]            ║  ← Red outline pulsing
║   (red outline)           ║
║                           ║
╚═══════════════════════════╝
```

- Vehicle outline: #EF4444 (red)
- Stroke width: 3px
- Pulse: 1s interval
- Warning badge: Top-center
- Door unlock animation (unauthorized)

### Replay Attack

**Visual:**
```
╔═══════════════════════════╗
║  ⚠️ REPLAY DETECTED       ║
║                           ║
║      [VEHICLE]            ║
║   ◉ ◉ ◉ (flashing 3x)    ║  ← Lights flash rapidly
║                           ║
╚═══════════════════════════╝
```

- Component flashing: 3x rapid
- Color: #F59E0B (orange)
- Timeline indicator: Shows repeated commands
- Warning badge: Top-center

### Broken Authentication

**Visual:**
```
╔═══════════════════════════╗
║  ⚠️ REMOTE SESSION ALERT  ║
║                           ║
║      [VEHICLE]            ║
║   📡 (red pulsing)        ║  ← Network indicator red
║                           ║
╚═══════════════════════════╝
```

- Network indicator: #EF4444 (red)
- Warning icon overlay
- Network signal bars pulsing red
- Semi-transparent red overlay

### OTA Manipulation

**Visual:**
```
╔═══════════════════════════╗
║  ⚠️ FIRMWARE COMPROMISED  ║
║                           ║
║      [VEHICLE]            ║
║   [▓▓▓░░░] (corrupted)   ║  ← Corrupted progress bar
║                           ║
╚═══════════════════════════╝
```

- Infotainment screen: #EF4444 (red)
- Corrupted progress bar animation
- Warning icon pulsing
- Vehicle outline warning glow

---

## Color Reference

### Vehicle Colors
- **Body:** #1A1A2E (dark metallic blue-gray)
- **Roof:** #16213E (darker blue)
- **Windows:** rgba(56, 189, 248, 0.15) (translucent blue)
- **Wheels:** #2D3748 (dark gray)
- **Chrome:** #E5E7EB (light gray)

### Status Colors
- **Locked:** #6D28D9 (primary purple)
- **Unlocked:** #10B981 (green)
- **Warning:** #F59E0B (orange)
- **Critical:** #EF4444 (red)
- **Info:** #38BDF8 (blue)
- **Accent:** #A855F7 (accent purple)

### Background Colors
- **Dashboard:** #0F0F14 (deep dark)
- **Panel:** #1A1A24 (dark panel)
- **Border:** rgba(109, 40, 217, 0.2) (purple border)

---

## Typography

### Font Families
- **Primary:** 'Inter', sans-serif
- **Monospace:** 'JetBrains Mono', monospace

### Font Sizes
- **Header:** 16px, semibold
- **Body:** 14px, regular
- **Small:** 12px, regular
- **Tiny:** 10px, regular

---

## Spacing

### Panel Spacing
- **Padding:** 32px
- **Border radius:** 16px
- **Gap between panels:** 24px

### Overlay Spacing
- **Padding:** 16px
- **Border radius:** 12px
- **Offset from edge:** 24px

### Component Spacing
- **Icon size:** 16-20px
- **Internal spacing:** 8-16px
- **Line height:** 1.5

---

## Final Appearance Summary

**The Vehicle Digital Twin should look like:**
- A professional automotive OEM digital twin platform
- A modern, premium connected vehicle visualization
- A cybersecurity research tool, not a game
- Clean, uncluttered, and purposeful
- Smooth, professional animations
- Real-time, responsive to backend events

**The Vehicle Digital Twin should NOT look like:**
- A racing game
- A cartoon or toy
- A student project
- A hacker-themed interface
- An overly animated game UI

---

*AutoAPI-X Vehicle Digital Twin Visual Mockup v1.0*  
*Professional Automotive Cybersecurity Visualization*

🚗🔐✨
