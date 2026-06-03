/**
 * Dashboard Metrics Bar Component
 * Automotive telemetry and system status
 */

import { motion } from 'framer-motion';
import { Activity, Radio, Wifi, Cpu, Shield, Zap } from 'lucide-react';
import { useVehicleStore } from '../../stores/vehicleStore';
import { useMemo } from 'react';

export const MetricsBar: React.FC = () => {
  const vehicle = useVehicleStore();
  const apiLogs = useVehicleStore(s => s.apiLogs);
  const canFrames = useVehicleStore(s => s.canFrames);
  
  // Calculate real-time metrics
  const metrics = useMemo(() => {
    return {
      vehicleStatus: vehicle.engine_status === 'running' ? 'Active' : 'Standby',
      connectedServices: [
        vehicle.network_status === 'connected',
        vehicle.gps_status === 'tracking',
        apiLogs.length > 0
      ].filter(Boolean).length,
      apiActivity: apiLogs.length,
      canActivity: canFrames.length,
      securityState: vehicle.doors_status === 'locked' ? 'Secure' : 'Unlocked',
      firmwareVersion: vehicle.firmware_version
    };
  }, [apiLogs, canFrames, vehicle]);
  
  return (
    <motion.div
      className="metrics-bar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Vehicle Status */}
      <div className="metric-card">
        <div className="metric-icon" style={{ 
          backgroundColor: metrics.vehicleStatus === 'Active' ? '#10B981' : '#6B7280'
        }}>
          <Zap className="w-5 h-5" />
        </div>
        <div className="metric-content">
          <span className="metric-value">{metrics.vehicleStatus}</span>
          <span className="metric-label">Vehicle Status</span>
        </div>
      </div>

      {/* Connected Services */}
      <div className="metric-card">
        <div className="metric-icon" style={{ backgroundColor: '#38BDF8' }}>
          <Wifi className="w-5 h-5" />
        </div>
        <div className="metric-content">
          <span className="metric-value">{metrics.connectedServices}/3</span>
          <span className="metric-label">Connected Services</span>
        </div>
      </div>

      {/* API Activity */}
      <motion.div 
        className="metric-card"
        animate={{ scale: apiLogs.length > 0 ? [1, 1.02, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="metric-icon" style={{ backgroundColor: apiLogs.length > 0 ? '#6D28D9' : '#4B5563' }}>
          <Activity className="w-5 h-5" />
        </div>
        <div className="metric-content">
          <span className="metric-value">{metrics.apiActivity}</span>
          <span className="metric-label">API Activity</span>
        </div>
      </motion.div>

      {/* CAN Activity */}
      <motion.div 
        className="metric-card"
        animate={{ scale: canFrames.length > 0 ? [1, 1.02, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="metric-icon" style={{ backgroundColor: canFrames.length > 0 ? '#A855F7' : '#4B5563' }}>
          <Radio className="w-5 h-5" />
        </div>
        <div className="metric-content">
          <span className="metric-value">{metrics.canActivity}</span>
          <span className="metric-label">CAN Activity</span>
        </div>
      </motion.div>

      {/* Security State */}
      <div className="metric-card">
        <div className="metric-icon" style={{ 
          backgroundColor: metrics.securityState === 'Secure' ? '#10B981' : '#F59E0B'
        }}>
          <Shield className="w-5 h-5" />
        </div>
        <div className="metric-content">
          <span className="metric-value">{metrics.securityState}</span>
          <span className="metric-label">Security State</span>
        </div>
      </div>

      {/* Firmware Version */}
      <div className="metric-card">
        <div className="metric-icon" style={{ backgroundColor: '#6B7280' }}>
          <Cpu className="w-5 h-5" />
        </div>
        <div className="metric-content">
          <span className="metric-value">{metrics.firmwareVersion}</span>
          <span className="metric-label">Firmware</span>
        </div>
      </div>
    </motion.div>
  );
};
