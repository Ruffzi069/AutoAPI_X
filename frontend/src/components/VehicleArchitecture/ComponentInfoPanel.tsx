/**
 * Component Info Panel
 * Right panel showing detailed information about selected component
 */

import { motion } from 'framer-motion';
import type { VehicleComponent } from '../../pages/VehicleArchitecture';
import './ComponentInfoPanel.css';

interface ComponentInfoPanelProps {
  component: VehicleComponent | null;
}

const getRiskColor = (level: string): string => {
  switch (level) {
    case 'Critical': return '#EF4444';
    case 'High': return '#F59E0B';
    case 'Medium': return '#FBBF24';
    case 'Low': return '#10B981';
    default: return '#6B7280';
  }
};

export const ComponentInfoPanel: React.FC<ComponentInfoPanelProps> = ({ component }) => {
  if (!component) {
    return (
      <div className="component-info-panel">
        <div className="info-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <p>Select a component to view details</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="component-info-panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="info-header">
        <h3>{component.name}</h3>
        <span className="component-type-badge">{component.type.toUpperCase()}</span>
      </div>

      <div className="info-section">
        <h4>Purpose</h4>
        <p>{component.purpose}</p>
      </div>

      <div className="info-section">
        <h4>Receives</h4>
        <div className="info-list">
          {component.receives.map((item, i) => (
            <div key={i} className="info-list-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h4>Sends</h4>
        <div className="info-list">
          {component.sends.map((item, i) => (
            <div key={i} className="info-list-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h4>Connected Systems</h4>
        <div className="info-list">
          {component.connectedSystems.map((item, i) => (
            <div key={i} className="info-list-item connected">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
              </svg>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h4>Related Attacks</h4>
        <div className="info-list">
          {component.relatedAttacks.map((item, i) => (
            <div key={i} className="info-list-item attack">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h4>Risk Level</h4>
        <div className="risk-level-display" style={{ color: getRiskColor(component.riskLevel) }}>
          <div className="risk-indicator-large" style={{ background: getRiskColor(component.riskLevel) }}></div>
          <span className="risk-level-text">{component.riskLevel}</span>
        </div>
      </div>
    </motion.div>
  );
};
