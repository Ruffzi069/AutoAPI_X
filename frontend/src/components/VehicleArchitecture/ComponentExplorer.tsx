/**
 * Component Explorer
 * Left panel showing all vehicle system components
 */

import { motion } from 'framer-motion';
import type { VehicleComponent } from '../../pages/VehicleArchitecture';
import type { AttackExecution } from '../../stores/attackStore';
import './ComponentExplorer.css';

interface ComponentExplorerProps {
  components: VehicleComponent[];
  selectedComponent: VehicleComponent | null;
  onSelectComponent: (component: VehicleComponent) => void;
  activeAttack: AttackExecution | null;
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

const getComponentIcon = (type: string): React.ReactElement => {
  switch (type) {
    case 'app':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M12 18h.01" />
        </svg>
      );
    case 'api':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      );
    case 'cloud':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
      );
    case 'telematics':
    case 'gateway':
    case 'ecu':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
        </svg>
      );
    case 'network':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M2 12h20" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'service':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      );
    default:
      return <div />;
  }
};

const isComponentAffected = (component: VehicleComponent, attack: AttackExecution | null): boolean => {
  if (!attack) return false;
  return component.relatedAttacks.includes(attack.attackId) || 
         component.relatedAttacks.includes(attack.attackName);
};

export const ComponentExplorer: React.FC<ComponentExplorerProps> = ({
  components,
  selectedComponent,
  onSelectComponent,
  activeAttack
}) => {
  return (
    <div className="component-explorer">
      <div className="explorer-header">
        <h3>Components</h3>
        <span className="component-count">{components.length}</span>
      </div>
      
      <div className="component-list">
        {components.map((component, i) => {
          const isSelected = selectedComponent?.id === component.id;
          const isAffected = isComponentAffected(component, activeAttack);
          
          return (
            <motion.div
              key={component.id}
              className={`component-item ${isSelected ? 'selected' : ''} ${isAffected ? 'affected' : ''}`}
              onClick={() => onSelectComponent(component)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <div className="component-icon-wrapper">
                {getComponentIcon(component.type)}
              </div>
              <div className="component-info">
                <span className="component-name">{component.name}</span>
                <span className="component-type">{component.type.toUpperCase()}</span>
              </div>
              <div className="component-risk" style={{ color: getRiskColor(component.riskLevel) }}>
                <div className="risk-indicator" style={{ background: getRiskColor(component.riskLevel) }}></div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
