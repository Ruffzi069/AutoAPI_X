/**
 * Vehicle Digital Twin Component
 * Professional 2.5D isometric Tesla Model 3 visualization
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useVehicleStore } from '../../stores/vehicleStore';
import './VehicleDigitalTwin.css';

export const VehicleDigitalTwin: React.FC = () => {
  const vehicle = useVehicleStore();
  
  const isLocked = vehicle.doors_status === 'locked';
  const isBootOpen = vehicle.boot_status === 'open';
  const isEngineRunning = vehicle.engine_status === 'running';
  const isLightsOn = vehicle.lights_status === 'on' || vehicle.lights_status === 'flashing';
  const isHornActive = vehicle.horn_status === 'active';
  const isGPSTracking = vehicle.gps_status === 'tracking';
  
  return (
    <div className="vehicle-digital-twin-container">
      {/* Vehicle Title */}
      <motion.div 
        className="vehicle-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Tesla Model 3</h2>
        <div className="vehicle-subtitle">
          <span className="status-badge" style={{ 
            backgroundColor: isEngineRunning ? '#10B981' : '#6D28D9' 
          }}>
            {isEngineRunning ? 'ACTIVE' : 'STANDBY'}
          </span>
          <span className="vin-text">VIN: {vehicle.vin}</span>
        </div>
      </motion.div>

      {/* Main Vehicle SVG */}
      <motion.div 
        className="vehicle-svg-wrapper"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <svg 
          viewBox="0 0 800 500" 
          className="vehicle-svg"
          style={{
            filter: isEngineRunning 
              ? 'drop-shadow(0 0 40px rgba(16, 185, 129, 0.4))'
              : 'drop-shadow(0 0 20px rgba(109, 40, 217, 0.2))'
          }}
        >
          {/* Vehicle Body - Isometric View */}
          <g id="vehicle-body" transform="translate(400, 250)">
            {/* Main Chassis */}
            <motion.path
              d="M -150,-80 L 150,-80 L 180,-40 L 180,40 L 150,60 L -150,60 L -180,40 L -180,-40 Z"
              fill="#1A1A2E"
              stroke="#2D3748"
              strokeWidth="2"
              animate={{
                stroke: isEngineRunning ? '#10B981' : '#6D28D9'
              }}
            />
            
            {/* Roof */}
            <path
              d="M -120,-80 L -80,-120 L 80,-120 L 120,-80 Z"
              fill="#16213E"
              stroke="#2D3748"
              strokeWidth="1.5"
            />
            
            {/* Windshield */}
            <path
              d="M -80,-120 L -120,-80 L 120,-80 L 80,-120 Z"
              fill="rgba(56, 189, 248, 0.15)"
              stroke="#38BDF8"
              strokeWidth="1"
              opacity="0.6"
            />
            
            {/* Side Windows */}
            <path
              d="M -120,-80 L -150,-60 L -150,0 L -120,-20 Z"
              fill="rgba(56, 189, 248, 0.12)"
              stroke="#38BDF8"
              strokeWidth="0.5"
            />
            <path
              d="M 120,-80 L 150,-60 L 150,0 L 120,-20 Z"
              fill="rgba(56, 189, 248, 0.12)"
              stroke="#38BDF8"
              strokeWidth="0.5"
            />
            
            {/* Front Door - Left */}
            <motion.g
              animate={{
                x: !isLocked ? -15 : 0,
                rotateY: !isLocked ? -10 : 0
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <path
                d="M -150,-40 L -120,-60 L -120,0 L -150,20 Z"
                fill="#1A1A2E"
                stroke={isLocked ? '#6D28D9' : '#10B981'}
                strokeWidth="2"
                style={{
                  filter: !isLocked ? 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.6))' : 'none'
                }}
              />
            </motion.g>
            
            {/* Front Door - Right */}
            <motion.g
              animate={{
                x: !isLocked ? 15 : 0,
                rotateY: !isLocked ? 10 : 0
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <path
                d="M 150,-40 L 120,-60 L 120,0 L 150,20 Z"
                fill="#1A1A2E"
                stroke={isLocked ? '#6D28D9' : '#10B981'}
                strokeWidth="2"
                style={{
                  filter: !isLocked ? 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.6))' : 'none'
                }}
              />
            </motion.g>
            
            {/* Trunk/Boot */}
            <motion.g
              animate={{
                y: isBootOpen ? -30 : 0,
                rotateX: isBootOpen ? -45 : 0
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ transformOrigin: 'center bottom' }}
            >
              <path
                d="M -150,40 L -120,20 L 120,20 L 150,40 L 150,60 L -150,60 Z"
                fill="#16213E"
                stroke={isBootOpen ? '#F59E0B' : '#2D3748'}
                strokeWidth="2"
                style={{
                  filter: isBootOpen ? 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))' : 'none'
                }}
              />
            </motion.g>
            
            {/* Headlights */}
            <motion.ellipse
              cx="-140"
              cy="-70"
              rx="12"
              ry="8"
              fill="#F8FAFC"
              animate={{
                opacity: isLightsOn ? [0.3, 1, 0.3] : 0.2,
                filter: isLightsOn 
                  ? 'drop-shadow(0 0 20px rgba(248, 250, 252, 0.9))'
                  : 'none'
              }}
              transition={{ 
                duration: vehicle.lights_status === 'flashing' ? 0.5 : 2,
                repeat: vehicle.lights_status === 'flashing' ? Infinity : 0
              }}
            />
            <motion.ellipse
              cx="140"
              cy="-70"
              rx="12"
              ry="8"
              fill="#F8FAFC"
              animate={{
                opacity: isLightsOn ? [0.3, 1, 0.3] : 0.2,
                filter: isLightsOn 
                  ? 'drop-shadow(0 0 20px rgba(248, 250, 252, 0.9))'
                  : 'none'
              }}
              transition={{ 
                duration: vehicle.lights_status === 'flashing' ? 0.5 : 2,
                repeat: vehicle.lights_status === 'flashing' ? Infinity : 0
              }}
            />
            
            {/* Taillights */}
            <motion.rect
              x="-145"
              y="50"
              width="20"
              height="8"
              rx="2"
              fill="#EF4444"
              animate={{
                opacity: isLightsOn ? [0.4, 1, 0.4] : 0.3
              }}
              transition={{ 
                duration: vehicle.lights_status === 'flashing' ? 0.5 : 2,
                repeat: vehicle.lights_status === 'flashing' ? Infinity : 0
              }}
            />
            <motion.rect
              x="125"
              y="50"
              width="20"
              height="8"
              rx="2"
              fill="#EF4444"
              animate={{
                opacity: isLightsOn ? [0.4, 1, 0.4] : 0.3
              }}
              transition={{ 
                duration: vehicle.lights_status === 'flashing' ? 0.5 : 2,
                repeat: vehicle.lights_status === 'flashing' ? Infinity : 0
              }}
            />
            
            {/* Wheels */}
            <g id="wheels">
              <circle cx="-100" cy="65" r="25" fill="#2D3748" stroke="#4A5568" strokeWidth="3" />
              <circle cx="-100" cy="65" r="15" fill="#1A202C" />
              <circle cx="100" cy="65" r="25" fill="#2D3748" stroke="#4A5568" strokeWidth="3" />
              <circle cx="100" cy="65" r="15" fill="#1A202C" />
            </g>
            
            {/* Tesla Logo */}
            <text
              x="0"
              y="-65"
              textAnchor="middle"
              fill="#A855F7"
              fontSize="16"
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
            >
              TESLA
            </text>
          </g>
          
          {/* Horn Sound Waves */}
          <AnimatePresence>
            {isHornActive && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={i}
                    cx="400"
                    cy="250"
                    r="50"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    initial={{ r: 50, opacity: 0.8 }}
                    animate={{ r: 200, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 1.5, 
                      delay: i * 0.3,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
          
          {/* GPS Beacon */}
          <AnimatePresence>
            {isGPSTracking && (
              <motion.g>
                <motion.circle
                  cx="400"
                  cy="150"
                  r="20"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  animate={{ r: [20, 40], opacity: [0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.path
                  d="M 400,130 L 400,170 M 380,150 L 420,150"
                  stroke="#38BDF8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
        
        {/* Lock/Unlock Indicator */}
        <AnimatePresence>
          {!isLocked && (
            <motion.div
              className="unlock-indicator"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z"
                  fill="#10B981"
                />
                <path
                  d="M7 10V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V8"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <rect x="5" y="10" width="14" height="10" rx="2" stroke="#10B981" strokeWidth="2" fill="none" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Vehicle Stats Bar */}
      <motion.div 
        className="vehicle-stats-bar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="stat-item">
          <div className="stat-icon" style={{ backgroundColor: '#10B981' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="10" rx="2" stroke="white" strokeWidth="2" />
              <path d="M6 11H10M14 11H18" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Battery</span>
            <span className="stat-value">{vehicle.battery}%</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon" style={{ 
            backgroundColor: vehicle.network_status === 'connected' ? '#10B981' : '#EF4444' 
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 20H12.01M8.5 16.5C9.88 15.12 11.84 14.5 13.5 14.5C15.16 14.5 17.12 15.12 18.5 16.5M5 13C7.76 10.24 11.88 9.5 15 9.5C18.12 9.5 22.24 10.24 25 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Network</span>
            <span className="stat-value">{vehicle.network_status}</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon" style={{ 
            backgroundColor: vehicle.gps_status === 'active' || vehicle.gps_status === 'tracking' ? '#38BDF8' : '#6B7280' 
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="white" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">GPS</span>
            <span className="stat-value">{vehicle.gps_status}</span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon" style={{ backgroundColor: '#A855F7' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="2" width="16" height="20" rx="2" stroke="white" strokeWidth="2" />
              <path d="M8 6H16M8 10H16M8 14H12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Firmware</span>
            <span className="stat-value">{vehicle.firmware_version}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
