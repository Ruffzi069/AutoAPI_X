import { useState } from 'react';
import SpotifyModule from '../components/Infotainment/SpotifyModule';
import MapsModule from '../components/Infotainment/MapsModule';
import WeatherModule from '../components/Infotainment/WeatherModule';
import OTACenter from '../components/Infotainment/OTACenter';
import PhoneModule from '../components/Infotainment/PhoneModule';
import MessagesModule from '../components/Infotainment/MessagesModule';
import { InfotainmentAPIMonitor } from '../components/Infotainment/InfotainmentAPIMonitor';
import { InfotainmentCANMonitor } from '../components/Infotainment/InfotainmentCANMonitor';
import { InfotainmentActivityFeed } from '../components/Infotainment/InfotainmentActivityFeed';
import './Infotainment.css';

type ActiveModule = 'spotify' | 'youtube' | 'maps' | 'weather' | 'ota' | 'phone' | 'messages' | null;
type TelemetryView = 'api' | 'can' | 'activity' | null;

export default function Infotainment() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('spotify');
  const [telemetryView, setTelemetryView] = useState<TelemetryView>(null);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'spotify':
      case 'youtube':
        return <SpotifyModule platform={activeModule} />;
      case 'maps':
        return <MapsModule />;
      case 'weather':
        return <WeatherModule />;
      case 'ota':
        return <OTACenter />;
      case 'phone':
        return <PhoneModule />;
      case 'messages':
        return <MessagesModule />;
      default:
        return <div className="welcome-screen">
          <h2>Welcome to Infotainment Center</h2>
          <p>Select a module to get started</p>
        </div>;
    }
  };

  const renderTelemetryView = () => {
    switch (telemetryView) {
      case 'api':
        return <InfotainmentAPIMonitor />;
      case 'can':
        return <InfotainmentCANMonitor />;
      case 'activity':
        return <InfotainmentActivityFeed />;
      default:
        return null;
    }
  };

  return (
    <div className="infotainment-container">
      <div className="infotainment-header">
        <h1>Infotainment Center</h1>
        <div className="header-controls">
          <button 
            className={`telemetry-toggle ${telemetryView ? 'active' : ''}`}
            onClick={() => setTelemetryView(telemetryView ? null : 'activity')}
            title="Toggle Telemetry Panel"
          >
            📊 Telemetry
          </button>
          <div className="time-display">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>

      <div className={`infotainment-content ${telemetryView ? 'with-telemetry' : ''}`}>
        <div className="display-area">
          {renderActiveModule()}
        </div>

        {telemetryView && (
          <div className="telemetry-panel">
            <div className="telemetry-tabs">
              <button
                className={`telemetry-tab ${telemetryView === 'activity' ? 'active' : ''}`}
                onClick={() => setTelemetryView('activity')}
              >
                <span>📋</span> Activity Feed
              </button>
              <button
                className={`telemetry-tab ${telemetryView === 'api' ? 'active' : ''}`}
                onClick={() => setTelemetryView('api')}
              >
                <span>📡</span> API Monitor
              </button>
              <button
                className={`telemetry-tab ${telemetryView === 'can' ? 'active' : ''}`}
                onClick={() => setTelemetryView('can')}
              >
                <span>🚗</span> CAN Monitor
              </button>
            </div>
            <div className="telemetry-content">
              {renderTelemetryView()}
            </div>
          </div>
        )}

        <div className="module-selector">
          <button
            className={`module-button ${activeModule === 'spotify' ? 'active' : ''}`}
            onClick={() => setActiveModule('spotify')}
          >
            <span className="module-icon">🎵</span>
            <span className="module-label">Spotify</span>
          </button>

          <button
            className={`module-button ${activeModule === 'youtube' ? 'active' : ''}`}
            onClick={() => setActiveModule('youtube')}
          >
            <span className="module-icon">▶️</span>
            <span className="module-label">YouTube</span>
          </button>

          <button
            className={`module-button ${activeModule === 'maps' ? 'active' : ''}`}
            onClick={() => setActiveModule('maps')}
          >
            <span className="module-icon">🗺️</span>
            <span className="module-label">Maps</span>
          </button>

          <button
            className={`module-button ${activeModule === 'weather' ? 'active' : ''}`}
            onClick={() => setActiveModule('weather')}
          >
            <span className="module-icon">☁️</span>
            <span className="module-label">Weather</span>
          </button>

          <button
            className={`module-button ${activeModule === 'ota' ? 'active' : ''}`}
            onClick={() => setActiveModule('ota')}
          >
            <span className="module-icon">⬇️</span>
            <span className="module-label">OTA</span>
          </button>

          <button
            className={`module-button ${activeModule === 'phone' ? 'active' : ''}`}
            onClick={() => setActiveModule('phone')}
          >
            <span className="module-icon">📱</span>
            <span className="module-label">Phone</span>
          </button>

          <button
            className={`module-button ${activeModule === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveModule('messages')}
          >
            <span className="module-icon">💬</span>
            <span className="module-label">Messages</span>
          </button>
        </div>
      </div>
    </div>
  );
}
