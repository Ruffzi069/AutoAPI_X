/**
 * Live Activity Feed Component
 * Comprehensive real-time activity timeline
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useVehicleStore } from '../../stores/vehicleStore';
import { Activity, Zap, AlertTriangle, Info } from 'lucide-react';
import './LiveActivityFeed.css';

export const LiveActivityFeed: React.FC = () => {
  const activities = useVehicleStore(s => s.activities);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Zap className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'error':
        return '#EF4444';
      default:
        return '#38BDF8';
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };
  
  return (
    <div className="live-activity-feed-full">
      <div className="feed-header">
        <div className="header-left">
          <Activity className="w-5 h-5" />
          <h3>Live Activity Feed</h3>
        </div>
        <div className="header-right">
          <div className="live-indicator">
            <div className="live-dot" />
            <span>LIVE</span>
          </div>
          <span className="activity-count">{activities.length} events</span>
        </div>
      </div>
      
      <div className="feed-content">
        <AnimatePresence initial={false}>
          {activities.length === 0 ? (
            <div className="feed-empty">
              <Activity className="w-12 h-12 text-gray-600" />
              <p>No activity yet</p>
              <span>Events will appear here in real-time</span>
            </div>
          ) : (
            activities.map((activity, index) => (
              <motion.div
                key={`${activity.timestamp}-${index}`}
                className="activity-item-full"
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="activity-timeline">
                  <div 
                    className="timeline-dot"
                    style={{ backgroundColor: getActivityColor(activity.type) }}
                  />
                  {index < activities.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="activity-content-full">
                  <div className="activity-header">
                    <div 
                      className="activity-icon-wrapper"
                      style={{ backgroundColor: getActivityColor(activity.type) + '20' }}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                      <span className="activity-text">{activity.action}</span>
                      {activity.transaction_id && (
                        <span style={{ 
                          fontSize: '9px', 
                          color: '#A855F7',
                          fontFamily: 'monospace'
                        }}>
                          {activity.transaction_id}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="activity-time">{formatTime(activity.timestamp)}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
