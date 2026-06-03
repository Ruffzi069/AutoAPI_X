/**
 * Settings Page
 * Platform configuration and preferences
 */

import './PlaceholderPage.css';

export default function Settings() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <div className="placeholder-icon">⚙️</div>
        <h1>Settings</h1>
        <p className="placeholder-description">
          Configure platform behavior, appearance, and integrations
        </p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Appearance</h3>
            <p>Theme, colors, and UI preferences</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔌</div>
            <h3>CAN Configuration</h3>
            <p>CAN interface and network settings</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Notifications</h3>
            <p>Alert and notification preferences</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Data Management</h3>
            <p>Database and logging configuration</p>
          </div>
        </div>
        
        <div className="coming-soon-badge">Coming Soon</div>
      </div>
    </div>
  );
}
