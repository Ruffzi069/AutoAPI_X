/**
 * Attack Path Visualization
 * Horizontal flow diagram showing attack progression
 */

import { motion } from 'framer-motion';
import type { AttackExecution } from '../../stores/attackStore';
import './AttackPathVisualization.css';

interface AttackPathVisualizationProps {
  execution: AttackExecution;
}

const getNodeColor = (type: string): string => {
  switch (type) {
    case 'attacker':
      return '#EF4444'; // Red
    case 'api':
      return '#8B5CF6'; // Purple
    case 'ecu':
      return '#3B82F6'; // Blue
    case 'vehicle':
      return '#F59E0B'; // Amber
    default:
      return '#6B7280'; // Gray
  }
};

const getNodeIcon = (type: string): React.ReactElement => {
  switch (type) {
    case 'attacker':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case 'api':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      );
    case 'ecu':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
        </svg>
      );
    case 'vehicle':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 11l2-7h10l2 7M5 11h14M5 11v5a2 2 0 002 2h10a2 2 0 002-2v-5" />
          <circle cx="8.5" cy="18" r="1.5" />
          <circle cx="15.5" cy="18" r="1.5" />
        </svg>
      );
    default:
      return <div />;
  }
};

export const AttackPathVisualization: React.FC<AttackPathVisualizationProps> = ({ execution }) => {
  const { attackPath } = execution;
  
  return (
    <div className="attack-path-visualization">
      <div className="path-header">
        <div>
          <h3>Attack Propagation Path</h3>
          <p className="path-subtitle">{attackPath.length} steps through system layers</p>
        </div>
      </div>
      
      <div className="path-flow-horizontal">
        {attackPath.map((node, i) => (
          <div key={i} className="flow-step-horizontal">
            {/* Node */}
            <motion.div
              className="flow-node-horizontal"
              style={{
                borderColor: getNodeColor(node.type),
                background: `${getNodeColor(node.type)}10`
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <div className="node-icon-container" style={{ color: getNodeColor(node.type) }}>
                {getNodeIcon(node.type)}
              </div>
              <div className="node-info-horizontal">
                <span className="node-component-horizontal">{node.component}</span>
                <span className="node-type-horizontal">{node.type.toUpperCase()}</span>
              </div>
            </motion.div>
            
            {/* Arrow to next node */}
            {i < attackPath.length - 1 && (
              <motion.div
                className="flow-arrow-horizontal"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 + 0.15 }}
              >
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                  <defs>
                    <linearGradient id={`arrowGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={getNodeColor(node.type)} stopOpacity="0.4" />
                      <stop offset="100%" stopColor={getNodeColor(attackPath[i + 1].type)} stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 12 L 30 12 M 30 12 L 25 7 M 30 12 L 25 17"
                    stroke={`url(#arrowGrad-${i})`}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            )}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="path-legend">
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-marker" style={{ background: '#EF4444' }}></div>
            <span>Threat Actor</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ background: '#8B5CF6' }}></div>
            <span>API Layer</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ background: '#3B82F6' }}></div>
            <span>ECU Layer</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ background: '#F59E0B' }}></div>
            <span>Vehicle Impact</span>
          </div>
        </div>
      </div>
    </div>
  );
};
