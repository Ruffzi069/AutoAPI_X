/**
 * Main Dashboard Component
 * Professional automotive cybersecurity platform with full telemetry
 */

import { useEffect } from 'react';
import { useSocketIO } from '../../hooks/useSocketIO';
import { MetricsBar } from './MetricsBar';
import { GooglePixelController } from '../GooglePixelController/GooglePixelController';
import { VehicleDigitalTwin } from '../VehicleDigitalTwin/VehicleDigitalTwinProfile';
import { VehicleInfoPanel } from '../VehicleInfoPanel/VehicleInfoPanel';
import { APITrafficMonitor } from '../Monitors/APITrafficMonitor';
import { CANTrafficMonitor } from '../Monitors/CANTrafficMonitor';
import { LiveActivityFeed } from './LiveActivityFeed';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  useSocketIO();
  
  useEffect(() => {
    console.log('✓ AutoAPI-X Platform initialized');
  }, []);
  
  return (
    <div className="dashboard-full-platform">
      {/* Header */}
      <header className="dashboard-header-redesign">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Real-time vehicle monitoring and control</p>
          </div>
          <div className="header-right">
            <div className="status-indicator">
              <div className="status-dot" />
              <span>System Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <MetricsBar />
      
      {/* Top Grid: Controller + Vehicle + Info */}
      <div className="dashboard-top-grid">
        <div className="grid-section controller-section">
          <GooglePixelController />
        </div>
        
        <div className="grid-section twin-section">
          <VehicleDigitalTwin />
        </div>
        
        <div className="grid-section info-section">
          <VehicleInfoPanel />
        </div>
      </div>

      {/* API Traffic Monitor */}
      <div className="monitor-section">
        <APITrafficMonitor />
      </div>

      {/* CAN Traffic Monitor */}
      <div className="monitor-section">
        <CANTrafficMonitor />
      </div>

      {/* Live Activity Feed */}
      <div className="monitor-section">
        <LiveActivityFeed />
      </div>
    </div>
  );
};
