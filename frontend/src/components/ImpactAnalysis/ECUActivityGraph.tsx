/**
 * ECU Activity Graph
 * Bar chart showing ECU involvement during attack
 */

import { motion } from 'framer-motion';
import type { AttackExecution } from '../../stores/attackStore';
import './ECUActivityGraph.css';

interface ECUActivityGraphProps {
  execution: AttackExecution;
}

export const ECUActivityGraph: React.FC<ECUActivityGraphProps> = ({ execution }) => {
  const { ecuActivity } = execution.telemetry;
  
  // Convert to array and sort by activity
  const ecuData = Object.entries(ecuActivity)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  const maxCount = Math.max(...ecuData.map(d => d.count), 1);
  
  return (
    <div className="ecu-activity-graph">
      <div className="graph-header">
        <div>
          <h3>ECU Impact</h3>
          <p className="graph-subtitle">Electronic Control Unit involvement</p>
        </div>
        <div className="graph-stat">
          <span className="stat-value">{ecuData.length}</span>
          <span className="stat-label">ECUs Affected</span>
        </div>
      </div>
      
      <div className="ecu-chart">
        {ecuData.map((ecu, i) => {
          const percentage = (ecu.count / maxCount) * 100;
          
          return (
            <motion.div
              key={ecu.name}
              className="ecu-bar-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="ecu-info">
                <span className="ecu-name">{ecu.name}</span>
                <span className="ecu-count">{ecu.count} event{ecu.count !== 1 ? 's' : ''}</span>
              </div>
              <div className="ecu-bar-container">
                <motion.div
                  className="ecu-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                >
                  <span className="bar-label">{ecu.count}</span>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* ECU Legend */}
      <div className="ecu-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ background: 'linear-gradient(90deg, #3B82F6 0%, rgba(59, 130, 246, 0.3) 100%)' }}></div>
          <span>Activity Level</span>
        </div>
      </div>
    </div>
  );
};
