/**
 * Architecture Insights
 * Educational panel explaining vehicle architecture
 */

import { motion } from 'framer-motion';
import './ArchitectureInsights.css';

export const ArchitectureInsights: React.FC = () => {
  return (
    <motion.div
      className="architecture-insights"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="insights-header">
        <svg className="insights-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <h3>Architecture Insights</h3>
      </div>
      <p className="insights-text">
        Connected vehicle commands originate from mobile applications and cloud services. 
        Requests are processed through telematics systems and routed through the Gateway ECU 
        before reaching individual ECUs over the CAN network. Attack simulations highlight 
        how compromised APIs can affect vehicle systems through this architecture.
      </p>
    </motion.div>
  );
};
