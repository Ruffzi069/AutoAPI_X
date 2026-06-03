/**
 * Vehicle SVG Profile Component
 * Premium Tesla Model 3 - Driver Side Profile
 * Professional automotive research platform visualization
 */

import { motion } from 'framer-motion';
import { useVehicleStore } from '../../stores/vehicleStore';

export const VehicleSVGProfile: React.FC = () => {
  const vehicle = useVehicleStore();
  
  const isLocked = vehicle.doors_status === 'locked';
  const isBootOpen = vehicle.boot_status === 'open';
  const isEngineRunning = vehicle.engine_status === 'running';
  const isLightsOn = vehicle.lights_status === 'on' || vehicle.lights_status === 'flashing';
  const isFlashing = vehicle.lights_status === 'flashing';
  const isGPSTracking = vehicle.gps_status === 'tracking';
  const isNetworkActive = vehicle.network_status === 'connected';
  
  return (
    <motion.div 
      className="vehicle-svg-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <svg 
        viewBox="0 0 1400 600" 
        className="vehicle-svg-profile"
        preserveAspectRatio="xMidYMid meet"
        style={{
          filter: isEngineRunning 
            ? 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.15))'
            : 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))',
          width: '100%',
          height: 'auto'
        }}
      >
        <defs>
          {/* Body gradient - premium metallic */}
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2C3440" />
            <stop offset="50%" stopColor="#1A1F28" />
            <stop offset="100%" stopColor="#0F1318" />
          </linearGradient>
          
          {/* Glass gradient - subtle realistic */}
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3A4350" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1F2937" stopOpacity="0.7" />
          </linearGradient>
          
          {/* Wheel gradient */}
          <radialGradient id="wheelGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#3A4350" />
            <stop offset="70%" stopColor="#1F2937" />
            <stop offset="100%" stopColor="#0F1318" />
          </radialGradient>
          
          {/* Headlight glow */}
          <filter id="headlightGlow">
            <feGaussianBlur stdDeviation="4" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="1.5" />
            </feComponentTransfer>
          </filter>
        </defs>

        {/* Ground Shadow */}
        <ellipse
          cx="700" cy="520" rx="450" ry="25"
          fill="#000000" opacity="0.15"
        />

        {/* === VEHICLE BODY - Premium Tesla Model 3 Profile === */}
        <g id="vehicle-body">
          
          {/* Main body shell - smooth aerodynamic profile */}
          <path
            d="M 250,440 
               L 240,420 
               Q 235,400 240,380
               L 260,345
               Q 280,310 300,300
               Q 340,280 380,270
               L 450,260
               Q 480,250 510,245
               L 540,242
               Q 560,235 580,225
               L 620,205
               Q 650,190 690,185
               L 900,185
               Q 940,188 970,200
               L 1010,225
               Q 1030,245 1040,270
               L 1060,310
               Q 1070,340 1075,370
               L 1080,400
               Q 1082,420 1090,440
               L 1095,460
               L 1090,470
               L 950,475
               L 950,470
               L 900,465
               L 450,465
               L 400,470
               L 250,470
               Z"
            fill="url(#bodyGrad)"
            stroke="#1A1F28"
            strokeWidth="1.5"
          />
          
          {/* Hood section */}
          <path
            d="M 260,345 L 300,300 Q 340,280 380,270 L 450,260 Q 465,258 480,256"
            fill="url(#bodyGrad)"
            stroke="#2C3440"
            strokeWidth="1"
          />
          
          {/* Front bumper detail */}
          <path
            d="M 240,380 L 250,360 Q 260,350 275,345 L 290,342"
            stroke="#3A4350"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Rocker panel - lower body line */}
          <line
            x1="280" y1="465" x2="1050" y2="465"
            stroke="#0F1318"
            strokeWidth="3"
          />
          <line
            x1="280" y1="468" x2="1050" y2="468"
            stroke="#2C3440"
            strokeWidth="1"
          />
          
          {/* Windshield - curved aerodynamic */}
          <path
            d="M 480,256 
               Q 505,242 530,232
               L 565,220
               Q 585,213 600,210
               L 630,207"
            fill="url(#glassGrad)"
            stroke="#2C3440"
            strokeWidth="2"
          />
          
          {/* Roof - sleek curved */}
          <path
            d="M 630,207 
               L 860,207
               Q 880,208 895,210"
            fill="url(#glassGrad)"
            stroke="#2C3440"
            strokeWidth="2"
          />
          
          {/* Rear windshield */}
          <path
            d="M 895,210
               Q 925,218 950,235
               L 985,260
               Q 1005,280 1015,300"
            fill="url(#glassGrad)"
            stroke="#2C3440"
            strokeWidth="2"
          />
          
          {/* A-Pillar */}
          <path
            d="M 480,256 L 530,232 Q 545,225 560,220"
            stroke="#0F1318"
            strokeWidth="8"
          />
          
          {/* B-Pillar */}
          <rect
            x="740" y="207" width="10" height="255" rx="2"
            fill="#0F1318"
          />
          
          {/* C-Pillar */}
          <path
            d="M 895,210 L 950,235 Q 970,250 985,275"
            stroke="#0F1318"
            strokeWidth="9"
          />
          
          {/* Front door */}
          <motion.g
            animate={{ 
              x: !isLocked ? -8 : 0,
              opacity: !isLocked ? 0.9 : 1
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <path
              d="M 530,232 L 530,465 L 735,465 L 735,225 Z"
              fill="url(#bodyGrad)"
              stroke="#1A1F28"
              strokeWidth="1.5"
            />
            <path
              d="M 540,245 L 725,235 L 725,450 L 540,455 Z"
              fill="url(#glassGrad)"
              stroke="#2C3440"
              strokeWidth="1"
            />
            {/* Door handle */}
            <rect
              x="660" y="350" width="35" height="4" rx="2"
              fill="#4B5563"
            />
          </motion.g>
          
          {/* Side mirror - proper car mirror shape */}
          <g transform="translate(515, 270)">
            <ellipse cx="0" cy="0" rx="20" ry="14" fill="#1A1F28" stroke="#2C3440" strokeWidth="1.5"/>
            <ellipse cx="2" cy="0" rx="14" ry="10" fill="#3A4350" opacity="0.4"/>
            <line x1="-15" y1="0" x2="-25" y2="5" stroke="#2C3440" strokeWidth="3"/>
          </g>
          
          {/* Rear door */}
          <path
            d="M 755,225 L 755,465 L 950,465 L 950,230 Z"
            fill="url(#bodyGrad)"
            stroke="#1A1F28"
            strokeWidth="1.5"
          />
          <path
            d="M 765,238 L 940,235 L 940,450 L 765,453 Z"
            fill="url(#glassGrad)"
            stroke="#2C3440"
            strokeWidth="1"
          />
          {/* Rear door handle */}
          <rect
            x="860" y="350" width="35" height="4" rx="2"
            fill="#4B5563"
          />
          
          {/* Trunk/Boot */}
          <motion.g
            animate={{ 
              rotate: isBootOpen ? -18 : 0,
              originX: 1030,
              originY: 300
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <path
              d="M 970,240 L 1040,270 L 1065,320 L 1070,380 L 1060,420 L 1050,445 L 1040,460 L 990,463 L 980,450 L 975,380 Z"
              fill="url(#bodyGrad)"
              stroke="#1A1F28"
              strokeWidth="1.5"
            />
            {/* Trunk window */}
            <path
              d="M 985,260 L 1020,280 L 1035,310 L 1025,340 L 1000,350 Z"
              fill="url(#glassGrad)"
              stroke="#2C3440"
              strokeWidth="1"
            />
          </motion.g>
          
          {/* Rear bumper */}
          <path
            d="M 1075,370 L 1090,400 Q 1095,420 1098,440"
            stroke="#3A4350"
            strokeWidth="2"
            fill="none"
          />
        </g>

        {/* === WHEELS - Premium 19" Aero === */}
        <g id="wheels">
          {/* Front wheel */}
          <g>
            <circle cx="410" cy="475" r="60" fill="url(#wheelGrad)" stroke="#0F1318" strokeWidth="4"/>
            <circle cx="410" cy="475" r="48" fill="#1F2937" stroke="#3A4350" strokeWidth="2"/>
            <circle cx="410" cy="475" r="20" fill="#0F1318"/>
            {/* Modern aero spokes */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <g key={`front-spoke-${i}`}>
                <line
                  x1="410" y1="475"
                  x2={410 + 42 * Math.cos((angle * Math.PI) / 180)}
                  y2={475 + 42 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#2C3440"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <line
                  x1="410" y1="475"
                  x2={410 + 38 * Math.cos((angle * Math.PI) / 180)}
                  y2={475 + 38 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#4B5563"
                  strokeWidth="2"
                />
              </g>
            ))}
            {/* Wheel arch */}
            <path
              d="M 350,440 Q 410,415 470,440"
              stroke="#1A1F28"
              strokeWidth="2"
              fill="none"
            />
          </g>
          
          {/* Rear wheel */}
          <g>
            <circle cx="950" cy="475" r="60" fill="url(#wheelGrad)" stroke="#0F1318" strokeWidth="4"/>
            <circle cx="950" cy="475" r="48" fill="#1F2937" stroke="#3A4350" strokeWidth="2"/>
            <circle cx="950" cy="475" r="20" fill="#0F1318"/>
            {/* Modern aero spokes */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <g key={`rear-spoke-${i}`}>
                <line
                  x1="950" y1="475"
                  x2={950 + 42 * Math.cos((angle * Math.PI) / 180)}
                  y2={475 + 42 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#2C3440"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <line
                  x1="950" y1="475"
                  x2={950 + 38 * Math.cos((angle * Math.PI) / 180)}
                  y2={475 + 38 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#4B5563"
                  strokeWidth="2"
                />
              </g>
            ))}
            {/* Wheel arch */}
            <path
              d="M 890,440 Q 950,415 1010,440"
              stroke="#1A1F28"
              strokeWidth="2"
              fill="none"
            />
          </g>
        </g>

        {/* === LIGHTS === */}
        <g id="lights">
          {/* Front headlight - LED style */}
          <motion.g
            animate={{ 
              opacity: isFlashing ? [1, 0.3, 1, 0.3, 1] : 1
            }}
            transition={{ duration: 0.6, repeat: isFlashing ? Infinity : 0 }}
          >
            <ellipse
              cx="265" cy="355" rx="18" ry="10"
              fill={isLightsOn ? "#E0F2FE" : "#2C3440"}
              stroke={isLightsOn ? "#38BDF8" : "#3A4350"}
              strokeWidth="2"
            />
            {isLightsOn && (
              <ellipse
                cx="265" cy="355" rx="22" ry="13"
                fill="#38BDF8"
                opacity="0.3"
                filter="url(#headlightGlow)"
              />
            )}
          </motion.g>
          
          {/* Daytime running light */}
          <line
            x1="255" y1="350" x2="275" y2="350"
            stroke={isEngineRunning ? "#E0F2FE" : "#3A4350"}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={isEngineRunning ? 0.8 : 0.3}
          />
          
          {/* Rear taillight - full width LED bar */}
          <motion.g
            animate={{ 
              opacity: isFlashing ? [1, 0.3, 1, 0.3, 1] : 1
            }}
            transition={{ duration: 0.6, repeat: isFlashing ? Infinity : 0 }}
          >
            <rect
              x="1075" y="380" width="12" height="25" rx="2"
              fill={isLightsOn ? "#FEE2E2" : "#2C3440"}
              stroke={isLightsOn ? "#EF4444" : "#3A4350"}
              strokeWidth="2"
            />
            {isLightsOn && (
              <rect
                x="1073" y="378" width="16" height="29" rx="3"
                fill="#EF4444"
                opacity="0.3"
                filter="url(#headlightGlow)"
              />
            )}
          </motion.g>
        </g>

        {/* === SUBTLE ENGINEERING OVERLAYS === */}
        <g id="ecu-overlays" opacity="0.6">
          {/* TCU indicator - rear */}
          {isNetworkActive && (
            <motion.g
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <circle cx="980" cy="350" r="4" fill="#6D28D9"/>
              <text x="988" y="353" fill="#9CA3AF" fontSize="10" fontFamily="monospace">TCU</text>
            </motion.g>
          )}
          
          {/* Gateway ECU - center */}
          {isEngineRunning && (
            <motion.g
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <circle cx="700" cy="370" r="4" fill="#38BDF8"/>
              <text x="708" y="373" fill="#9CA3AF" fontSize="10" fontFamily="monospace">GW</text>
            </motion.g>
          )}
          
          {/* GPS Module */}
          {isGPSTracking && (
            <motion.g
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <circle cx="800" cy="220" r="4" fill="#10B981"/>
              <text x="808" y="223" fill="#9CA3AF" fontSize="10" fontFamily="monospace">GPS</text>
            </motion.g>
          )}
          
          {/* BMS indicator - battery */}
          {vehicle.battery > 20 && (
            <motion.g
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
            >
              <rect x="520" y="460" width="200" height="3" rx="1.5" fill="#F59E0B" opacity="0.3"/>
              <text x="620" y="455" textAnchor="middle" fill="#9CA3AF" fontSize="9" fontFamily="monospace">
                BMS
              </text>
            </motion.g>
          )}
        </g>

        {/* === STATUS INDICATORS === */}
        {/* Lock indicator */}
        {isLocked && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <circle cx="640" cy="340" r="22" fill="rgba(239, 68, 68, 0.15)" stroke="#EF4444" strokeWidth="2"/>
            <text x="640" y="348" textAnchor="middle" fontSize="20" opacity="0.9">🔒</text>
          </motion.g>
        )}
        
        {/* GPS tracking indicator */}
        {isGPSTracking && (
          <motion.g
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <circle cx="700" cy="150" r="18" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.6"/>
            <circle cx="700" cy="150" r="12" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.8"/>
            <circle cx="700" cy="150" r="6" fill="#10B981"/>
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
};
