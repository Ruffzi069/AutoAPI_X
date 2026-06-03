import { motion } from 'framer-motion';
import type { AttackExecution } from '../../stores/attackStore';
import './ComponentImpact.css';

export const ComponentImpact: React.FC<{execution: AttackExecution}> = ({ execution }) => (
  <div className="component-impact">
    <h2>Component Impact</h2>
    <div className="impact-bars">
      <div className="impact-bar-item">
        <span className="bar-label">APIs Affected</span>
        <div className="bar-container">
          <motion.div className="bar-fill" style={{width: `${(execution.affectedAPIs.length / 5) * 100}%`, backgroundColor: '#3B82F6'}} initial={{width: 0}} animate={{width: `${(execution.affectedAPIs.length / 5) * 100}%`}} transition={{duration: 0.8}} />
        </div>
        <span className="bar-value">{execution.affectedAPIs.length}</span>
      </div>
      <div className="impact-bar-item">
        <span className="bar-label">ECUs Affected</span>
        <div className="bar-container">
          <motion.div className="bar-fill" style={{width: `${(execution.affectedECUs.length / 5) * 100}%`, backgroundColor: '#A855F7'}} initial={{width: 0}} animate={{width: `${(execution.affectedECUs.length / 5) * 100}%`}} transition={{duration: 0.8, delay: 0.1}} />
        </div>
        <span className="bar-value">{execution.affectedECUs.length}</span>
      </div>
      <div className="impact-bar-item">
        <span className="bar-label">Components Affected</span>
        <div className="bar-container">
          <motion.div className="bar-fill" style={{width: `${(execution.affectedComponents.length / 5) * 100}%`, backgroundColor: '#10B981'}} initial={{width: 0}} animate={{width: `${(execution.affectedComponents.length / 5) * 100}%`}} transition={{duration: 0.8, delay: 0.2}} />
        </div>
        <span className="bar-value">{execution.affectedComponents.length}</span>
      </div>
    </div>
  </div>
);
