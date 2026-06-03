/**
 * Google Pixel Phone Frame Component
 */

import { motion } from 'framer-motion';
import './PhoneFrame.css';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  
  return (
    <motion.div
      className="phone-frame"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Status Bar */}
      <div className="phone-status-bar">
        <div className="status-left">
          <span className="time text-xs font-medium">{currentTime}</span>
        </div>
        <div className="status-notch" />
        <div className="status-right flex items-center gap-1 text-xs">
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>
      
      {/* App Content */}
      <div className="phone-content">
        {children}
      </div>
      
      {/* Navigation Bar */}
      <div className="phone-nav-bar">
        <div className="nav-indicator" />
      </div>
    </motion.div>
  );
};
