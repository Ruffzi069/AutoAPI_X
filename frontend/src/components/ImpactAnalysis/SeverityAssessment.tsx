/**
 * Severity Assessment Component
 * Clean vertical gauge showing attack severity
 */

import { motion } from 'framer-motion';
import type { AttackExecution } from '../../stores/attackStore';
import './SeverityAssessment.css';

interface SeverityAssessmentProps {
  execution: AttackExecution;
}

export const SeverityAssessment: React.FC<SeverityAssessmentProps> = ({ execution }) => {
  const maxRisk = Math.max(...Object.values(execution.riskDistribution));
  
  const getSeverityLevel = (risk: number): {label: string, color: string} => {
    if (risk >= 85) return { label: 'Critical', color: '#EF4444' };
    if (risk >= 70) return { label: 'High', color: '#F59E0B' };
    if (risk >= 50) return { label: 'Medium', color: '#FBBF24' };
    return { label: 'Low', color: '#10B981' };
  };

  const severity = getSeverityLevel(maxRisk);

  return (
    <div className="severity-assessment">
      <div className="severity-header">
        <h3>Severity</h3>
        <p className="severity-subtitle">Attack impact level</p>
      </div>
      
      <div className="severity-gauge">
        <div className="gauge-track">
          <motion.div
            className="gauge-fill"
            style={{ backgroundColor: severity.color }}
            initial={{ height: 0 }}
            animate={{ height: `${maxRisk}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        
        <div className="gauge-markers">
          <div className="marker-line" style={{bottom: '85%'}}>
            <span className="marker-dot"></span>
            <span className="marker-label">Critical</span>
          </div>
          <div className="marker-line" style={{bottom: '70%'}}>
            <span className="marker-dot"></span>
            <span className="marker-label">High</span>
          </div>
          <div className="marker-line" style={{bottom: '50%'}}>
            <span className="marker-dot"></span>
            <span className="marker-label">Medium</span>
          </div>
          <div className="marker-line" style={{bottom: '25%'}}>
            <span className="marker-dot"></span>
            <span className="marker-label">Low</span>
          </div>
        </div>
      </div>

      <div className="severity-result">
        <span className="severity-label" style={{ color: severity.color }}>
          {severity.label}
        </span>
        <span className="severity-value">{maxRisk}%</span>
      </div>
    </div>
  );
};
