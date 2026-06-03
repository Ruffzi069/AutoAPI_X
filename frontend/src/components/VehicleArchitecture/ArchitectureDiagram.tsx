/**
 * Architecture Diagram
 * Large interactive vehicle digital twin with component overlays
 */

import { motion } from 'framer-motion';
import type { VehicleComponent } from '../../pages/VehicleArchitecture';
import type { AttackExecution } from '../../stores/attackStore';
import './ArchitectureDiagram.css';

interface ArchitectureDiagramProps {
  components: VehicleComponent[];
  onSelectComponent: (component: VehicleComponent) => void;
  activeAttack: AttackExecution | null;
}

const isComponentAffected = (component: VehicleComponent, attack: AttackExecution | null): boolean => {
  if (!attack) return false;
  return component.relatedAttacks.includes(attack.attackId) || 
         component.relatedAttacks.includes(attack.attackName);
};

// Component physical locations on vehicle
const componentLocations: Record<string, { x: number; y: number; label: string }> = {
  'gps-module': { x: 420, y: 80, label: 'GPS' },
  'infotainment-ecu': { x: 460, y: 140, label: 'Infotainment' },
  'ota-service': { x: 520, y: 120, label: 'OTA' },
  'gateway-ecu': { x: 400, y: 180, label: 'Gateway ECU' },
  'bcm': { x: 340, y: 160, label: 'Body Control' },
  'door-ecu': { x: 340, y: 200, label: 'Door Control' },
  'tcu': { x: 620, y: 160, label: 'Telematics' },
  'can-network': { x: 400, y: 250, label: 'CAN Network' }
};

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  components,
  onSelectComponent,
  activeAttack
}) => {
  const getComponentById = (id: string) => components.find(c => c.id === id);

  return (
    <div className="architecture-diagram">
      <div className="diagram-header">
        <h3>Vehicle Systems Architecture</h3>
        {activeAttack && (
          <span className="attack-indicator">
            Active: {activeAttack.attackName}
          </span>
        )}
      </div>
      
      <div className="diagram-content">
        <svg viewBox="0 0 800 350" className="vehicle-architecture-svg">
          <defs>
            <linearGradient id="bodyGradArch" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2C3440" />
              <stop offset="50%" stopColor="#1A1F28" />
              <stop offset="100%" stopColor="#0F1318" />
            </linearGradient>
            <linearGradient id="glassGradArch" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3A4350" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1F2937" stopOpacity="0.7" />
            </linearGradient>
            <radialGradient id="wheelGradArch">
              <stop offset="0%" stopColor="#3A4350" />
              <stop offset="70%" stopColor="#1F2937" />
              <stop offset="100%" stopColor="#0F1318" />
            </radialGradient>
          </defs>

          {/* Ground Shadow */}
          <ellipse cx="400" cy="295" rx="280" ry="15" fill="#000000" opacity="0.15" />

          {/* Tesla Model 3 Main Body */}
          <path
            d="M 150,250 L 145,235 Q 140,220 145,210 L 160,185 Q 175,165 195,160 L 260,150 Q 285,145 305,142 L 330,139 Q 345,135 360,130 L 390,117 Q 410,108 435,106 L 560,106 Q 590,108 610,118 L 635,135 Q 645,150 650,170 L 655,195 Q 657,215 665,250 L 655,275 L 635,280 L 180,280 L 160,275 Z"
            fill="url(#bodyGradArch)"
            stroke="#3A4350"
            strokeWidth="1.5"
          />

          {/* Windows */}
          <path
            d="M 340,137 L 410,110 L 520,110 L 560,127 L 560,165 L 340,165 Z"
            fill="url(#glassGradArch)"
          />

          {/* Front Wheel */}
          <g>
            <circle cx="235" cy="280" r="35" fill="url(#wheelGradArch)" stroke="#3A4350" strokeWidth="3" />
            <circle cx="235" cy="280" r="20" fill="#0F1318" />
          </g>

          {/* Rear Wheel */}
          <g>
            <circle cx="580" cy="280" r="35" fill="url(#wheelGradArch)" stroke="#3A4350" strokeWidth="3" />
            <circle cx="580" cy="280" r="20" fill="#0F1318" />
          </g>

          {/* Headlight */}
          <ellipse cx="665" cy="215" rx="8" ry="10" fill="#4B5563" />

          {/* Component Markers */}
          {Object.entries(componentLocations).map(([id, loc]) => {
            const component = getComponentById(id);
            if (!component) return null;

            const isAffected = isComponentAffected(component, activeAttack);
            const markerColor = isAffected ? '#EF4444' : '#8B5CF6';

            return (
              <g key={id} onClick={() => onSelectComponent(component)} className="component-marker-group">
                {/* Component Area Highlight */}
                <motion.circle
                  cx={loc.x}
                  cy={loc.y}
                  r="20"
                  fill={isAffected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.12)'}
                  stroke={markerColor}
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="component-area"
                />

                {/* Component Icon Background */}
                <motion.circle
                  cx={loc.x}
                  cy={loc.y}
                  r="10"
                  fill="rgba(0, 0, 0, 0.6)"
                  stroke={markerColor}
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="component-icon-bg"
                />

                {/* Component Indicator Dot */}
                <circle
                  cx={loc.x}
                  cy={loc.y}
                  r="4"
                  fill={markerColor}
                />

                {/* Component Label */}
                <motion.text
                  x={loc.x}
                  y={loc.y - 30}
                  textAnchor="middle"
                  fill={isAffected ? '#EF4444' : '#E5E7EB'}
                  fontSize="11"
                  fontWeight="600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="component-label"
                >
                  {loc.label}
                </motion.text>

                {/* Callout Line */}
                <motion.line
                  x1={loc.x}
                  y1={loc.y - 20}
                  x2={loc.x}
                  y2={loc.y - 28}
                  stroke={markerColor}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                />
              </g>
            );
          })}

          {/* External Components (Cloud/Mobile) */}
          {/* Mobile App Indicator */}
          <g transform="translate(100, 50)">
            <motion.rect
              x="0" y="0" width="60" height="40" rx="6"
              fill="rgba(139, 92, 246, 0.15)"
              stroke="#8B5CF6"
              strokeWidth="2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="external-component"
            />
            <text x="30" y="25" textAnchor="middle" fill="#E5E7EB" fontSize="10" fontWeight="600">
              Mobile
            </text>
          </g>

          {/* API Gateway Indicator */}
          <g transform="translate(100, 110)">
            <motion.rect
              x="0" y="0" width="60" height="40" rx="6"
              fill={isComponentAffected(components[1], activeAttack) ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)'}
              stroke={isComponentAffected(components[1], activeAttack) ? '#EF4444' : '#8B5CF6'}
              strokeWidth="2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="external-component"
              onClick={() => onSelectComponent(components[1])}
            />
            <text x="30" y="25" textAnchor="middle" fill="#E5E7EB" fontSize="10" fontWeight="600">
              API GW
            </text>
          </g>

          {/* Cloud Backend Indicator */}
          <g transform="translate(100, 170)">
            <motion.rect
              x="0" y="0" width="60" height="40" rx="6"
              fill={isComponentAffected(components[2], activeAttack) ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)'}
              stroke={isComponentAffected(components[2], activeAttack) ? '#EF4444' : '#8B5CF6'}
              strokeWidth="2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="external-component"
              onClick={() => onSelectComponent(components[2])}
            />
            <text x="30" y="25" textAnchor="middle" fill="#E5E7EB" fontSize="10" fontWeight="600">
              Cloud
            </text>
          </g>

          {/* Connection Lines to Vehicle */}
          <motion.line
            x1="160" y1="190" x2="620" y2="160"
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth="2"
            strokeDasharray="5 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </svg>
      </div>

      <div className="architecture-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#8B5CF6' }}></div>
          <span>Normal</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#EF4444' }}></div>
          <span>Attack Impact</span>
        </div>
      </div>
    </div>
  );
};
