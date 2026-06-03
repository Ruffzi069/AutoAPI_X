/**
 * Infotainment API Activity Monitor
 * Dedicated telemetry panel for infotainment API observability
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import './InfotainmentAPIMonitor.css';

interface APILog {
  timestamp: string;
  method: string;
  endpoint: string;
  requestPayload?: any;
  responsePayload?: any;
  statusCode: number;
  latency: number;
  serviceName: string;
  transactionId?: string;
}

export const InfotainmentAPIMonitor: React.FC = () => {
  const [apiLogs, setApiLogs] = useState<APILog[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Connect to Socket.IO for real-time updates
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });
    
    socket.on('connect', () => {
      console.log('API Monitor connected to Socket.IO');
    });

    socket.on('api_updates', (data) => {
      if (isInfotainmentEndpoint(data.endpoint)) {
        const log: APILog = {
          timestamp: data.timestamp,
          method: data.method,
          endpoint: data.endpoint,
          requestPayload: data.request,
          responsePayload: data.response,
          statusCode: data.status,
          latency: data.latency || 0,
          serviceName: getServiceFromEndpoint(data.endpoint),
          transactionId: data.transaction_id
        };
        addAPILog(log);
      }
    });

    socket.on('disconnect', () => {
      console.log('API Monitor disconnected from Socket.IO');
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

  const addAPILog = (log: APILog) => {
    setApiLogs(prev => [log, ...prev].slice(0, 50)); // Keep last 50 logs
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

  const getServiceIcon = (service: string): string => {
    const icons: Record<string, string> = {
      'Media': '🎵',
      'Navigation': '🗺️',
      'Weather': '☁️',
      'OTA': '⬇️',
      'Phone': '📱',
      'Messages': '💬'
    };
    return icons[service] || '📡';
  };

  const getStatusColor = (statusCode: number): string => {
    if (statusCode >= 200 && statusCode < 300) return '#10B981';
    if (statusCode >= 400 && statusCode < 500) return '#F59E0B';
    return '#EF4444';
  };

  const filteredLogs = filter === 'all' 
    ? apiLogs 
    : apiLogs.filter(log => getServiceFromEndpoint(log.endpoint).toLowerCase() === filter);

  return (
    <div className="infotainment-api-monitor">
      <div className="monitor-header">
        <div className="header-left">
          <h3>
            <span className="header-icon">📡</span>
            Infotainment API Activity
          </h3>
          <span className="log-count">{filteredLogs.length} events</span>
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
            className={`filter-btn ${filter === 'weather' ? 'active' : ''}`}
            onClick={() => setFilter('weather')}
          >
            ☁️ Weather
          </button>
        </div>
      </div>

      <div className="api-logs-container">
        {filteredLogs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📡</span>
            <p>No infotainment API activity yet</p>
            <p className="empty-subtext">Interact with media, navigation, or other services</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredLogs.map((log, index) => {
              const service = getServiceFromEndpoint(log.endpoint);
              return (
                <motion.div
                  key={`${log.timestamp}-${index}`}
                  className="api-log-entry"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="log-main">
                    <div className="log-time">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="log-service">
                      <span className="service-icon">{getServiceIcon(service)}</span>
                      <span className="service-name">{service}</span>
                    </div>
                    <div className="log-method-endpoint">
                      <span 
                        className="method-badge" 
                        style={{ backgroundColor: log.method === 'GET' ? '#38BDF8' : '#A855F7' }}
                      >
                        {log.method}
                      </span>
                      <span className="endpoint-path">{log.endpoint}</span>
                    </div>
                    <div className="log-status">
                      <span 
                        className="status-code"
                        style={{ color: getStatusColor(log.statusCode) }}
                      >
                        {log.statusCode}
                      </span>
                      <span className="latency">{log.latency}ms</span>
                    </div>
                  </div>
                  
                  {log.transactionId && (
                    <div className="log-transaction">
                      <span className="txn-label">TXN:</span>
                      <span className="txn-id">{log.transactionId}</span>
                    </div>
                  )}

                  {log.requestPayload && (
                    <details className="log-payload">
                      <summary>Request Payload</summary>
                      <pre>{JSON.stringify(log.requestPayload, null, 2)}</pre>
                    </details>
                  )}

                  {log.responsePayload && (
                    <details className="log-payload">
                      <summary>Response Payload</summary>
                      <pre>{JSON.stringify(log.responsePayload, null, 2)}</pre>
                    </details>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
