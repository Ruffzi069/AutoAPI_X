/**
 * Affected Systems Component
 * Visualizes affected APIs, ECUs, and Components
 */

import { motion } from 'framer-motion';
import type { AttackExecution } from '../../stores/attackStore';
import './AffectedSystems.css';

interface AffectedSystemsProps {
  execution: AttackExecution;
}

export const AffectedSystems: React.FC<AffectedSystemsProps> = ({ execution }) => {
  return (
    <div className="affected-systems">
      <div className="systems-header">
        <h2>Affected Systems</h2>
        <span className="systems-count">{execution.affectedAPIs.length + execution.affectedECUs.length + execution.affectedComponents.length} components</span>
      </div>

      <div className="systems-grid">
        <div className="system-category">
          <h3>
            <span className="category-icon">📡</span>
            APIs
          </h3>
          <div className="system-list">
            {execution.affectedAPIs.map((api, index) => (
              <motion.div
                key={index}
                className="system-item api"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="item-bullet">•</span>
                <span className="item-text">{api}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="system-category">
          <h3>
            <span className="category-icon">🖥️</span>
            ECUs
          </h3>
          <div className="system-list">
            {execution.affectedECUs.map((ecu, index) => (
              <motion.div
                key={index}
                className="system-item ecu"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="item-bullet">•</span>
                <span className="item-text">{ecu}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="system-category">
          <h3>
            <span className="category-icon">⚙️</span>
            Components
          </h3>
          <div className="system-list">
            {execution.affectedComponents.map((component, index) => (
              <motion.div
                key={index}
                className="system-item component"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="item-bullet">•</span>
                <span className="item-text">{component}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
