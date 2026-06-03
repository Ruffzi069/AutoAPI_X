/**
 * Vehicle Information Panel Component
 * Professional OEM-grade vehicle monitoring
 */

import { motion } from 'framer-motion';
import { useVehicleStore } from '../../stores/vehicleStore';
import { LiveActivityFeed } from '../Dashboard/LiveActivityFeed';
import { Battery, Wifi, MapPin, Cpu, Lock, Package, Zap, Lightbulb } from 'lucide-react';
import './VehicleInfoPanel.css';

export const VehicleInfoPanel: React.FC = () => {
  const vehicle = useVehicleStore();
  
  const getStatusColor = (status: string) => {
    if (status === 'connected' || status === 'active' || status === 'on' || status === 'running') {
      return '#10B981';
    }
    if (status === 'unlocked' || status === 'open') {
      return '#F59E0B';
    }
    return '#6B7280';
  };
  
  const getBatteryColor = (battery: number) => {
    if (battery > 50) return '#10B981';
    if (battery > 20) return '#F59E0B';
    return '#EF4444';
  };
  
  return (
    <motion.div
      className="vehicle-info-panel-redesign"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Vehicle Overview */}
      <div className="info-card">
        <div className="card-header">
          <h3>Vehicle Overview</h3>
          <span className="status-badge active">ONLINE</span>
        </div>
        <div className="vehicle-info-grid">
          <div className="info-row">
            <span className="info-label">Model</span>
            <span className="info-value">Tesla Model 3</span>
          </div>
          <div className="info-row">
            <span className="info-label">VIN</span>
            <span className="info-value mono">{vehicle.vin}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Owner</span>
            <span className="info-value">{vehicle.owner}</span>
          </div>
        </div>
      </div>

      {/* Connectivity */}
      <div className="info-card">
        <div className="card-header">
          <h3>Connectivity</h3>
        </div>
        <div className="status-grid">
          <div className="status-item-card">
            <div className="status-icon-wrapper" style={{ backgroundColor: getStatusColor(vehicle.network_status) }}>
              <Wifi className="w-4 h-4" />
            </div>
            <div>
              <div className="status-label">Network</div>
              <div className="status-value" style={{ color: getStatusColor(vehicle.network_status) }}>
                {vehicle.network_status}
              </div>
            </div>
          </div>
          <div className="status-item-card">
            <div className="status-icon-wrapper" style={{ backgroundColor: getStatusColor(vehicle.gps_status) }}>
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="status-label">GPS</div>
              <div className="status-value" style={{ color: getStatusColor(vehicle.gps_status) }}>
                {vehicle.gps_status}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle State */}
      <div className="info-card">
        <div className="card-header">
          <h3>Vehicle State</h3>
        </div>
        <div className="state-list">
          <div className="state-item">
            <div className="state-icon-wrapper" style={{ backgroundColor: getStatusColor(vehicle.doors_status) }}>
              <Lock className="w-4 h-4" />
            </div>
            <span className="state-label">Doors</span>
            <span className="state-badge" style={{ 
              backgroundColor: getStatusColor(vehicle.doors_status) + '20',
              color: getStatusColor(vehicle.doors_status)
            }}>
              {vehicle.doors_status}
            </span>
          </div>
          <div className="state-item">
            <div className="state-icon-wrapper" style={{ backgroundColor: getStatusColor(vehicle.boot_status) }}>
              <Package className="w-4 h-4" />
            </div>
            <span className="state-label">Boot</span>
            <span className="state-badge" style={{ 
              backgroundColor: getStatusColor(vehicle.boot_status) + '20',
              color: getStatusColor(vehicle.boot_status)
            }}>
              {vehicle.boot_status}
            </span>
          </div>
          <div className="state-item">
            <div className="state-icon-wrapper" style={{ backgroundColor: getStatusColor(vehicle.engine_status) }}>
              <Zap className="w-4 h-4" />
            </div>
            <span className="state-label">Engine</span>
            <span className="state-badge" style={{ 
              backgroundColor: getStatusColor(vehicle.engine_status) + '20',
              color: getStatusColor(vehicle.engine_status)
            }}>
              {vehicle.engine_status}
            </span>
          </div>
          <div className="state-item">
            <div className="state-icon-wrapper" style={{ backgroundColor: getStatusColor(vehicle.lights_status) }}>
              <Lightbulb className="w-4 h-4" />
            </div>
            <span className="state-label">Lights</span>
            <span className="state-badge" style={{ 
              backgroundColor: getStatusColor(vehicle.lights_status) + '20',
              color: getStatusColor(vehicle.lights_status)
            }}>
              {vehicle.lights_status}
            </span>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="info-card">
        <div className="card-header">
          <h3>System Health</h3>
        </div>
        <div className="health-grid">
          <div className="health-item">
            <div className="health-icon" style={{ backgroundColor: getBatteryColor(vehicle.battery) }}>
              <Battery className="w-5 h-5" />
            </div>
            <div className="health-content">
              <span className="health-label">Battery Level</span>
              <div className="health-bar">
                <motion.div 
                  className="health-fill"
                  style={{ backgroundColor: getBatteryColor(vehicle.battery) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${vehicle.battery}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span className="health-value">{vehicle.battery}%</span>
            </div>
          </div>
          <div className="health-item">
            <div className="health-icon" style={{ backgroundColor: '#A855F7' }}>
              <Cpu className="w-5 h-5" />
            </div>
            <div className="health-content">
              <span className="health-label">Firmware</span>
              <span className="health-value mono">{vehicle.firmware_version}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="info-card">
        <LiveActivityFeed />
      </div>
    </motion.div>
  );
};
