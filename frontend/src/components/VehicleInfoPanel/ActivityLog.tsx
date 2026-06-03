/**
 * Activity Log Component
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { Activity } from '../../types/vehicle.types';

interface ActivityLogProps {
  activities: Activity[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-critical';
      default: return 'text-info';
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
    <div className="activity-log">
      <h3 className="text-sm font-semibold text-gray-300 mb-3 pb-2 border-b border-primary-purple/20">
        Recent Activity
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence initial={false}>
          {activities.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No recent activity</p>
          ) : (
            activities.map((activity, index) => (
              <motion.div
                key={`${activity.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="activity-item flex items-start gap-2 text-xs p-2 rounded bg-panel/50"
              >
                <span className="text-gray-500 font-mono">
                  {formatTime(activity.timestamp)}
                </span>
                <span className={`flex-1 ${getActivityColor(activity.type)}`}>
                  {activity.action}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
