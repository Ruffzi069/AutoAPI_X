/**
 * Infotainment Activity Feed
 * Unified timeline view of all infotainment service activity
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import './InfotainmentActivityFeed.css';

interface ActivityEvent {
  timestamp: string;
  service: string;
  action: string;
  description: string;
  transactionId?: string;
  status: 'success' | 'warning' | 'error';
}

export const InfotainmentActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Connect to Socket.IO for real-time activity updates
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });
    
    socket.on('connect', () => {
      console.log('Activity Feed connected to Socket.IO');
    });

    // Listen to multiple event types and consolidate into activity feed
    socket.on('event_updates', (data) => {
      const activity: ActivityEvent = {
        timestamp: data.timestamp,
        service: getServiceFromEventType(data.event_type),
        action: formatEventType(data.event_type),
        description: data.description,
        transactionId: data.transaction_id,
        status: data.severity === 'error' ? 'error' : 'success'
      };
      addActivity(activity);
    });

    socket.on('api_updates', (data) => {
      if (isInfotainmentEndpoint(data.endpoint)) {
        const activity: ActivityEvent = {
          timestamp: data.timestamp,
          service: getServiceFromEndpoint(data.endpoint),
          action: `${data.method} ${extractAction(data.endpoint)}`,
          description: `Status: ${data.status}`,
          transactionId: data.transaction_id,
          status: data.status >= 200 && data.status < 300 ? 'success' : 'error'
        };
        addActivity(activity);
      }
    });

    socket.on('disconnect', () => {
      console.log('Activity Feed disconnected from Socket.IO');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const isInfotainmentEndpoint = (endpoint: string): boolean => {
    return endpoint.includes('/media') || 
           endpoint.includes('/navigation') || 
           endpoint.includes('/weather') ||
           endpoint.includes('/ota') ||
           endpoint.includes('/phone') ||
           endpoint.includes('/messages');
  };

  const getServiceFromEndpoint = (endpoint: string): string => {
    if (endpoint.includes('/media')) return 'Media';
    if (endpoint.includes('/navigation')) return 'Navigation';
    if (endpoint.includes('/weather')) return 'Weather';
    if (endpoint.includes('/ota')) return 'OTA';
    if (endpoint.includes('/phone')) return 'Phone';
    if (endpoint.includes('/messages')) return 'Messages';
    return 'Unknown';
  };

  const getServiceFromEventType = (eventType: string): string => {
    if (eventType.includes('MEDIA') || eventType.includes('SPOTIFY')) return 'Spotify';
    if (eventType.includes('NAV')) return 'Navigation';
    if (eventType.includes('WEATHER')) return 'Weather';
    if (eventType.includes('OTA')) return 'OTA';
    if (eventType.includes('PHONE')) return 'Phone';
    if (eventType.includes('MESSAGE')) return 'Messages';
    return 'System';
  };

  const formatEventType = (eventType: string): string => {
    return eventType.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const extractAction = (endpoint: string): string => {
    const parts = endpoint.split('/');
    return parts[parts.length - 1] || 'action';
  };

  const addActivity = (event: ActivityEvent) => {
    setActivities(prev => [event, ...prev].slice(0, 100)); // Keep last 100 activities
  };

  const getServiceIcon = (service: string): string => {
    const icons: Record<string, string> = {
      'Spotify': '🎵',
      'YouTube Music': '▶️',
      'Navigation': '🗺️',
      'Weather': '☁️',
      'OTA': '⬇️',
      'Phone': '📱',
      'Messages': '💬'
    };
    return icons[service] || '📡';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(activity => activity.service.toLowerCase().includes(filter));

  return (
    <div className="infotainment-activity-feed">
      <div className="feed-header">
        <div className="header-left">
          <h3>
            <span className="header-icon">📋</span>
            Infotainment Activity Timeline
          </h3>
          <span className="activity-count">{filteredActivities.length} events</span>
        </div>
        <div className="filter-controls">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'media' ? 'active' : ''}`}
            onClick={() => setFilter('media')}
          >
            🎵 Media
          </button>
          <button 
            className={`filter-btn ${filter === 'navigation' ? 'active' : ''}`}
            onClick={() => setFilter('navigation')}
          >
            🗺️ Nav
          </button>
          <button 
            className={`filter-btn ${filter === 'phone' ? 'active' : ''}`}
            onClick={() => setFilter('phone')}
          >
            📱 Phone
          </button>
        </div>
      </div>

      <div className="activity-timeline">
        {filteredActivities.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p>No activity recorded yet</p>
            <p className="empty-subtext">Infotainment interactions will appear here in real-time</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={`${activity.timestamp}-${index}`}
                className="activity-entry"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="activity-timeline-marker">
                  <div 
                    className="marker-dot"
                    style={{ backgroundColor: getStatusColor(activity.status) }}
                  />
                  {index < filteredActivities.length - 1 && (
                    <div className="marker-line" />
                  )}
                </div>

                <div className="activity-content">
                  <div className="activity-header">
                    <div className="activity-service">
                      <span className="service-icon">{getServiceIcon(activity.service)}</span>
                      <span className="service-name">{activity.service}</span>
                    </div>
                    <div className="activity-time">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="activity-details">
                    <span className="activity-action">{activity.action}</span>
                    {activity.description && (
                      <span className="activity-description">{activity.description}</span>
                    )}
                  </div>

                  {activity.transactionId && (
                    <div className="activity-transaction">
                      <span className="txn-label">TXN:</span>
                      <span className="txn-id">{activity.transactionId}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
