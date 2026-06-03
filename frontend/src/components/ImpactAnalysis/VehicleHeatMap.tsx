/**
 * Vehicle Heat Map
 * Tesla Model 3 side profile with professional component markers
 */

import { motion } from 'framer-motion';
import type { AttackExecution } from '../../stores/attackStore';
import './VehicleHeatMap.css';

interface VehicleHeatMapProps {
  execution: AttackExecution;
}

export const VehicleHeatMap: React.FC<VehicleHeatMapProps> = ({ execution }) => {
  const { vehicleHeatMap, affectedComponents } = execution;
  
  const isAreaAffected = (area: string) => vehicleHeatMap.includes(area);
  
  return (
    <div className="vehicle-heat-map">
      <div className="heatmap-header">
        <div>
          <h3>Vehicle Component Impact</h3>
          <p className="heatmap-subtitle">{vehicleHeatMap.length} system{vehicleHeatMap.length !== 1 ? 's' : ''} affected</p>
        </div>
      </div>
      
      <div className="vehicle-diagram">
        <svg viewBox="0 0 800 350" className="heatmap-svg">
          <defs>
            <linearGradient id="bodyGradHeat" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2C3440" />
              <stop offset="50%" stopColor="#1A1F28" />
              <stop offset="100%" stopColor="#0F1318" />
            </linearGradient>
            <linearGradient id="glassGradHeat" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3A4350" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1F2937" stopOpacity="0.7" />
            </linearGradient>
            <radialGradient id="wheelGradHeat">
              <stop offset="0%" stopColor="#3A4350" />
              <stop offset="70%" stopColor="#1F2937" />
              <stop offset="100%" stopColor="#0F1318" />
            </radialGradient>
          </defs>

          {/* Ground Shadow */}
          <ellipse cx="400" cy="295" rx="280" ry="15" fill="#000000" opacity="0.15" />

          {/* Main Body */}
          <path
            d="M 150,250 L 145,235 Q 140,220 145,210 L 160,185 Q 175,165 195,160 L 260,150 Q 285,145 305,142 L 330,139 Q 345,135 360,130 L 390,117 Q 410,108 435,106 L 560,106 Q 590,108 610,118 L 635,135 Q 645,150 650,170 L 655,195 Q 657,215 665,250 L 655,275 L 635,280 L 180,280 L 160,275 Z"
            fill="url(#bodyGradHeat)"
            stroke="#3A4350"
            strokeWidth="1.5"
          />

          {/* Windows */}
          <path
            d="M 340,137 L 410,110 L 520,110 L 560,127 L 560,165 L 340,165 Z"
            fill="url(#glassGradHeat)"
          />

          {/* Door System Highlight */}
          {isAreaAffected('door') && (
            <g>
              <motion.rect
                x="300" y="165" width="80" height="85" rx="3"
                fill="rgba(239, 68, 68, 0.12)"
                stroke="#EF4444"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              <rect x="292" y="157" width="96" height="101" rx="5" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <text x="340" y="153" fontSize="11" fill="#EF4444" fontWeight="600" textAnchor="middle">
                Door Control ECU
              </text>
            </g>
          )}

          {/* Front Wheel */}
          <g>
            <circle cx="235" cy="280" r="35" fill="url(#wheelGradHeat)" stroke="#3A4350" strokeWidth="3" />
            <circle cx="235" cy="280" r="20" fill="#0F1318" />
          </g>

          {/* Rear Wheel */}
          <g>
            <circle cx="580" cy="280" r="35" fill="url(#wheelGradHeat)" stroke="#3A4350" strokeWidth="3" />
            <circle cx="580" cy="280" r="20" fill="#0F1318" />
          </g>

          {/* Headlight */}
          <ellipse cx="665" cy="215" rx="8" ry="10" fill="#4B5563" />
          
          {/* Lights Highlight */}
          {isAreaAffected('lights') && (
            <g>
              <motion.circle
                cx="665" cy="215" r="15"
                fill="rgba(251, 191, 36, 0.15)"
                stroke="#FBBF24"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              <circle cx="665" cy="215" r="22" fill="none" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <text x="665" y="247" fontSize="11" fill="#FBBF24" fontWeight="600" textAnchor="middle">
                Body Control ECU
              </text>
            </g>
          )}

          {/* GPS Module Highlight */}
          {isAreaAffected('gps') && (
            <g>
              <motion.circle
                cx="400" cy="95" r="18"
                fill="rgba(245, 158, 11, 0.15)"
                stroke="#F59E0B"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              <circle cx="400" cy="95" r="25" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <text x="400" y="75" fontSize="11" fill="#F59E0B" fontWeight="600" textAnchor="middle">
                GPS Module
              </text>
            </g>
          )}

          {/* Network/Gateway Highlight */}
          {isAreaAffected('network') && (
            <g>
              <motion.rect
                x="605" y="125" width="60" height="60" rx="5"
                fill="rgba(59, 130, 246, 0.12)"
                stroke="#3B82F6"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              <rect x="600" y="120" width="70" height="70" rx="7" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <text x="635" y="115" fontSize="11" fill="#3B82F6" fontWeight="600" textAnchor="middle">
                Gateway ECU
              </text>
            </g>
          )}

          {/* Firmware/Infotainment Highlight */}
          {isAreaAffected('firmware') && (
            <g>
              <motion.rect
                x="425" y="130" width="75" height="50" rx="5"
                fill="rgba(168, 85, 247, 0.12)"
                stroke="#A855F7"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              <rect x="420" y="125" width="85" height="60" rx="7" fill="none" stroke="#A855F7" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <text x="462" y="118" fontSize="11" fill="#A855F7" fontWeight="600" textAnchor="middle">
                Infotainment ECU
              </text>
            </g>
          )}

          {/* Horn Highlight */}
          {isAreaAffected('horn') && (
            <g>
              <motion.circle
                cx="180" cy="200" r="18"
                fill="rgba(245, 158, 11, 0.15)"
                stroke="#F59E0B"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
              <circle cx="180" cy="200" r="25" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <text x="180" y="180" fontSize="11" fill="#F59E0B" fontWeight="600" textAnchor="middle">
                Horn Module
              </text>
            </g>
          )}
        </svg>
      </div>
      
      {/* Affected Components List */}
      <div className="component-list">
        {affectedComponents.map((component, i) => (
          <motion.div
            key={i}
            className="component-item"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <svg className="component-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
            </svg>
            <span className="component-name">{component}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
