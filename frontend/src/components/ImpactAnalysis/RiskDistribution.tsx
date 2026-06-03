import { motion } from 'framer-motion';
import type { AttackExecution } from '../../stores/attackStore';
import './RiskDistribution.css';

export const RiskDistribution: React.FC<{execution: AttackExecution}> = ({ execution }) => (
  <div className="risk-distribution">
    <h2>Risk Distribution</h2>
    <div className="risk-grid">
      {Object.entries(execution.riskDistribution).map(([key, value], index) => (
        <motion.div key={key} className="risk-item" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: index * 0.1}}>
          <span className="risk-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          <span className="risk-value" style={{color: value >= 70 ? '#EF4444' : value >= 50 ? '#F59E0B' : '#10B981'}}>{value}%</span>
        </motion.div>
      ))}
    </div>
  </div>
);
