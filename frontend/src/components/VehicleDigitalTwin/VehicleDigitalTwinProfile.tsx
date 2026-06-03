/**
 * Vehicle Digital Twin Component
 * Premium Tesla Model 3 - Professional Research Platform
 */

import { motion } from 'framer-motion';
import { useVehicleStore } from '../../stores/vehicleStore';
import { VehicleSVGProfile } from './VehicleSVGProfile';
import './VehicleDigitalTwin.css';

export const VehicleDigitalTwin: React.FC = () => {
  const vehicle = useVehicleStore();
  
  const isEngineRunning = vehicle.engine_status === 'running';
  const networkStatus = vehicle.network_status === 'connected' ? 'Connected' : 
                        vehicle.network_status === 'disconnected' ? 'Disconnected' : 'Offline';
  
  return (
    <div className="vehicle-digital-twin-profile">
      {/* Vehicle Title */}
      <motion.div 
        className="vehicle-title"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: '700', 
          color: '#FFFFFF',
          marginBottom: '6px',
          letterSpacing: '-0.3px'
        }}>
          Tesla Model 3
        </h2>
        <div className="vehicle-subtitle" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px' 
        }}>
          <span 
            className="status-badge" 
            style={{ 
              backgroundColor: isEngineRunning ? '#10B981' : '#4B5563',
              color: '#FFFFFF',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '0.4px'
            }}
          >
            {isEngineRunning ? 'ACTIVE' : 'STANDBY'}
          </span>
          <span 
            className="vin-text" 
            style={{ 
              color: '#6B7280', 
              fontSize: '11px',
              fontWeight: '500',
              fontFamily: 'monospace'
            }}
          >
            VIN: {vehicle.vin}
          </span>
        </div>
      </motion.div>

      {/* Main Vehicle SVG */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <VehicleSVGProfile />
      </div>

      {/* Vehicle Stats Bar */}
      <motion.div 
        className="vehicle-stats-bar"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          padding: '14px',
          background: 'rgba(26, 26, 36, 0.3)',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            className="stat-icon" 
            style={{ 
              backgroundColor: vehicle.battery > 50 ? '#10B981' : vehicle.battery > 20 ? '#F59E0B' : '#EF4444',
              width: 36,
              height: 36,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="18" height="10" rx="2" stroke="white" strokeWidth="2" />
              <rect x="20" y="10" width="2" height="4" fill="white" />
            </svg>
          </div>
          <div className="stat-content">
            <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Battery
            </div>
            <div style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: '700' }}>
              {vehicle.battery}%
            </div>
          </div>
        </div>

        <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            className="stat-icon" 
            style={{ 
              backgroundColor: vehicle.network_status === 'connected' ? '#10B981' : '#6B7280',
              width: 36,
              height: 36,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.55a11 11 0 0114.08 0M8.5 16.5a6 6 0 017 0M12 20h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="stat-content">
            <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Network
            </div>
            <div style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: '700' }}>
              {networkStatus}
            </div>
          </div>
        </div>

        <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            className="stat-icon" 
            style={{ 
              backgroundColor: vehicle.gps_status === 'tracking' ? '#10B981' : '#6B7280',
              width: 36,
              height: 36,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="white" strokeWidth="2" fill="none" />
              <circle cx="12" cy="9" r="2.5" fill="white" />
            </svg>
          </div>
          <div className="stat-content">
            <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              GPS
            </div>
            <div style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: '700', textTransform: 'capitalize' }}>
              {vehicle.gps_status}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
