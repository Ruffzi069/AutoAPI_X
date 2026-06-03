# Vehicle Digital Twin - Quick Reference Guide

**For Developers** | **AutoAPI-X Phase 2**

---

## 🎯 Quick Start

### Technology Stack
```bash
# Core
- React 18+
- TypeScript
- Framer Motion
- Socket.IO Client
- Tailwind CSS
- Zustand

# Install
npm install framer-motion socket.io-client zustand
```

### Project Structure
```
src/components/VehicleDigitalTwin/
├── VehicleDigitalTwin.tsx          # Main component
├── VehicleSVG.tsx                  # SVG vehicle
├── VehicleEffects.tsx              # Visual effects
├── VehicleStatusOverlay.tsx        # Status display
├── SecurityEventVisualizer.tsx     # Attack visuals
└── components/
    ├── DoorComponent.tsx
    ├── TrunkComponent.tsx
    ├── HeadlightComponent.tsx
    └── ...
```

---

## 🎨 Color Palette

```typescript
const colors = {
  // Vehicle
  vehicleBody: '#1A1A2E',
  vehicleRoof: '#16213E',
  vehicleWindows: 'rgba(56, 189, 248, 0.15)',
  
  // Status
  locked: '#6D28D9',      // Purple
  unlocked: '#10B981',    // Green
  warning: '#F59E0B',     // Orange
  critical: '#EF4444',    // Red
  info: '#38BDF8',        // Blue
  accent: '#A855F7',      // Light purple
  
  // Background
  dashboard: '#0F0F14',
  panel: '#1A1A24',
  border: 'rgba(109, 40, 217, 0.2)'
};
```

---

## 🔧 Component Templates

### Basic Component
```typescript
import { motion } from 'framer-motion';

interface ComponentProps {
  status: string;
}

export const Component: React.FC<ComponentProps> = ({ status }) => {
  return (
    <motion.g
      animate={status}
      variants={variants}
    >
      {/* SVG content */}
    </motion.g>
  );
};
```

### Door Component
```typescript
const doorVariants = {
  locked: { 
    stroke: "#6D28D9", 
    strokeWidth: 2,
    filter: "drop-shadow(0 0 8px rgba(109, 40, 217, 0.6))"
  },
  unlocked: { 
    stroke: "#10B981", 
    strokeWidth: 2 
  },
  open: { 
    rotate: -15, 
    x: -10,
    transition: { duration: 0.8 }
  }
};
```

---

## 📡 Socket.IO Integration

```typescript
import { io } from 'socket.io-client';
import { useVehicleStore } from '@/stores/vehicleStore';

export const useVehicleState = () => {
  const updateState = useVehicleStore(s => s.updateVehicleState);
  
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('vehicle_updates', (data) => {
      updateState(data);
    });
    
    socket.on('security_event', (event) => {
      // Handle security event
    });
    
    return () => socket.disconnect();
  }, []);
};
```

---

## 🎭 Animation Patterns

### Pulse Effect
```typescript
const pulse = {
  scale: [1, 1.1, 1],
  opacity: [1, 0.8, 1],
  transition: { duration: 1, repeat: Infinity }
};
```

### Glow Effect
```typescript
const glow = {
  filter: "drop-shadow(0 0 20px rgba(109, 40, 217, 0.8))",
  transition: { duration: 0.5 }
};
```

### Fade In
```typescript
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 }
};
```

---

## 🔐 Security Event Handling

```typescript
const securityEventVariants = {
  idor: {
    stroke: "#EF4444",
    strokeWidth: 3,
    opacity: [1, 0.6, 1],
    transition: { duration: 1, repeat: Infinity }
  },
  replay: {
    // Flashing effect
  },
  broken_auth: {
    // Network warning
  }
};
```

---

## 📊 State Management

```typescript
// Zustand Store
export const useVehicleStore = create<VehicleState>((set) => ({
  vin: '5YJ3E1EA1KF000001',
  battery: 84,
  doors: {
    frontLeft: 'locked',
    frontRight: 'locked',
    rearLeft: 'locked',
    rearRight: 'locked'
  },
  
  updateVehicleState: (updates) => 
    set((state) => ({ ...state, ...updates }))
}));
```

---

## 🎯 Performance Tips

1. **Use React.memo** for components
2. **Limit animations** to 3-5 simultaneous
3. **Use transform/opacity** only
4. **Debounce** rapid updates
5. **Lazy load** non-critical components

```typescript
export const DoorComponent = memo<DoorComponentProps>(
  ({ position, status }) => {
    // Component code
  },
  (prev, next) => prev.status === next.status
);
```

---

## 📐 SVG Structure

```xml
<svg viewBox="0 0 800 600">
  <!-- Vehicle Body -->
  <g id="vehicle-body">
    <path d="..." fill="#1A1A2E" />
  </g>
  
  <!-- Doors -->
  <g id="doors">
    <g id="door-fl" />
    <g id="door-fr" />
  </g>
  
  <!-- Lights -->
  <g id="headlights">
    <ellipse cx="..." cy="..." />
  </g>
</svg>
```

---

## 🔍 Debugging

```typescript
// Enable Framer Motion debug
<motion.div
  animate={...}
  onAnimationStart={() => console.log('Animation started')}
  onAnimationComplete={() => console.log('Animation complete')}
/>

// Log state changes
useEffect(() => {
  console.log('Vehicle state:', vehicleState);
}, [vehicleState]);
```

---

## ✅ Checklist

### Component Implementation
- [ ] Create SVG vehicle
- [ ] Add interactive components
- [ ] Implement animations
- [ ] Connect to Socket.IO
- [ ] Add status overlay
- [ ] Implement security visuals

### Testing
- [ ] Test all door states
- [ ] Test all light states
- [ ] Test security events
- [ ] Test real-time updates
- [ ] Test performance (60fps)

### Polish
- [ ] Optimize animations
- [ ] Add accessibility
- [ ] Test responsive design
- [ ] Cross-browser testing

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `VehicleDigitalTwin.tsx` | Main component |
| `vehicleStore.ts` | State management |
| `useVehicleState.ts` | Socket.IO hook |
| `vehicleAnimations.ts` | Animation variants |
| `vehicle.types.ts` | TypeScript types |

---

## 🚀 Common Tasks

### Add New Component
1. Create component file
2. Define variants
3. Add to VehicleSVG
4. Update state interface
5. Test animations

### Add Security Event
1. Define event type
2. Create visualization
3. Add to SecurityEventVisualizer
4. Test with backend

### Update Animation
1. Modify variants
2. Test performance
3. Adjust timing
4. Verify smoothness

---

## 💡 Best Practices

1. **Keep animations smooth** (60fps target)
2. **Use semantic HTML** where possible
3. **Add ARIA labels** for accessibility
4. **Optimize SVG** before use
5. **Test on real devices**
6. **Follow design system** colors
7. **Document complex logic**
8. **Write unit tests**

---

## 🐛 Common Issues

### Animation Lag
- Reduce simultaneous animations
- Use `will-change` CSS property
- Optimize SVG complexity

### State Not Updating
- Check Socket.IO connection
- Verify store subscription
- Check backend events

### Visual Glitches
- Check z-index layering
- Verify SVG viewBox
- Test browser compatibility

---

## 📞 Resources

- **Design Spec:** `VEHICLE_DIGITAL_TWIN_DESIGN.md`
- **Visual Mockup:** `VEHICLE_TWIN_VISUAL_MOCKUP.md`
- **Framer Motion:** https://www.framer.com/motion/
- **Socket.IO:** https://socket.io/docs/v4/client-api/
- **Zustand:** https://github.com/pmndrs/zustand

---

*Quick Reference Guide v1.0*  
*AutoAPI-X Vehicle Digital Twin*

🚗💻⚡
