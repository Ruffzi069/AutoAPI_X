/**
 * Google Pixel Controller Component
 * Modern Tesla-style vehicle control interface
 */

import { PhoneFrame } from './PhoneFrame';
import { ControlCard } from './ControlCard';
import { useVehicleStore } from '../../stores/vehicleStore';
import { useVehicleAPI } from '../../hooks/useVehicleAPI';
import { Lock, Unlock, Volume2, Lightbulb, Package, Power, MapPin } from 'lucide-react';
import './GooglePixelController.css';

export const GooglePixelController: React.FC = () => {
  const vehicle = useVehicleStore();
  const api = useVehicleAPI();
  
  const getBatteryColor = () => {
    if (vehicle.battery > 50) return '#10B981';
    if (vehicle.battery > 20) return '#F59E0B';
    return '#EF4444';
  };
  
  return (
    <PhoneFrame>
      <div className="pixel-app">
        {/* Vehicle Header Card */}
        <div className="vehicle-header-card">
          <div className="vehicle-image-placeholder">
            <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
              <path d="M20 40 L40 25 L80 25 L100 40 L100 50 L20 50 Z" fill="#6D28D9" opacity="0.3" />
              <path d="M40 25 L50 15 L70 15 L80 25 Z" fill="#A855F7" opacity="0.3" />
              <circle cx="35" cy="52" r="8" fill="#4B5563" />
              <circle cx="85" cy="52" r="8" fill="#4B5563" />
            </svg>
          </div>
          <h3 className="vehicle-name">Tesla Model 3</h3>
          <p className="vehicle-status">{vehicle.engine_status === 'running' ? 'Active' : 'Parked'}</p>
          
          {/* Battery Indicator */}
          <div className="battery-indicator">
            <div className="battery-bar">
              <div 
                className="battery-fill" 
                style={{ 
                  width: `${vehicle.battery}%`,
                  backgroundColor: getBatteryColor()
                }}
              />
            </div>
            <span className="battery-text">{vehicle.battery}%</span>
          </div>
        </div>

        {/* Quick Status */}
        <div className="quick-status-grid">
          <div className="status-chip">
            <Lock className="w-4 h-4" />
            <span>{vehicle.doors_status}</span>
          </div>
          <div className="status-chip">
            <Package className="w-4 h-4" />
            <span>{vehicle.boot_status}</span>
          </div>
          <div className="status-chip">
            <Power className="w-4 h-4" />
            <span>{vehicle.engine_status}</span>
          </div>
        </div>

        {/* Control Sections */}
        <div className="control-sections">
          {/* Vehicle Access */}
          <div className="control-section">
            <h4 className="section-title">Vehicle Access</h4>
            <div className="control-grid-2">
              <ControlCard
                icon={<Lock className="w-6 h-6" />}
                label="Lock"
                sublabel="Secure vehicle"
                onClick={api.lock}
                loading={api.loading === 'lock'}
                active={vehicle.doors_status === 'locked'}
              />
              <ControlCard
                icon={<Unlock className="w-6 h-6" />}
                label="Unlock"
                sublabel="Open doors"
                onClick={api.unlock}
                loading={api.loading === 'unlock'}
                active={vehicle.doors_status === 'unlocked'}
              />
            </div>
          </div>

          {/* Vehicle Controls */}
          <div className="control-section">
            <h4 className="section-title">Vehicle Controls</h4>
            <div className="control-grid-2">
              <ControlCard
                icon={<Volume2 className="w-6 h-6" />}
                label="Horn"
                sublabel="Sound alert"
                onClick={api.horn}
                loading={api.loading === 'horn'}
                variant="secondary"
              />
              <ControlCard
                icon={<Lightbulb className="w-6 h-6" />}
                label="Flash Lights"
                sublabel="3x flash"
                onClick={api.flashLights}
                loading={api.loading === 'lights'}
                variant="secondary"
              />
              <ControlCard
                icon={<Package className="w-6 h-6" />}
                label="Open Boot"
                sublabel="Trunk access"
                onClick={api.openBoot}
                loading={api.loading === 'boot'}
                variant="secondary"
              />
              <ControlCard
                icon={<Package className="w-6 h-6" />}
                label="Close Boot"
                sublabel="Secure trunk"
                onClick={api.closeBoot}
                loading={api.loading === 'closeBoot'}
                variant="secondary"
              />
            </div>
          </div>

          {/* Power & Climate */}
          <div className="control-section">
            <h4 className="section-title">Power & Climate</h4>
            <div className="control-grid-2">
              <ControlCard
                icon={<Power className="w-6 h-6" />}
                label="Start Engine"
                sublabel="Power on"
                onClick={api.startEngine}
                loading={api.loading === 'start'}
                active={vehicle.engine_status === 'running'}
              />
              <ControlCard
                icon={<Power className="w-6 h-6" />}
                label="Stop Engine"
                sublabel="Power off"
                onClick={api.stopEngine}
                loading={api.loading === 'stop'}
                variant="secondary"
              />
            </div>
          </div>

          {/* Location & Services */}
          <div className="control-section">
            <h4 className="section-title">Location & Services</h4>
            <div className="control-grid-1">
              <ControlCard
                icon={<MapPin className="w-6 h-6" />}
                label="Locate Vehicle"
                sublabel="GPS tracking"
                onClick={api.locate}
                loading={api.loading === 'locate'}
                variant="secondary"
                fullWidth
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {api.error && (
          <div className="error-banner">
            <span className="error-icon">⚠</span>
            <span className="error-text">{api.error}</span>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
};
