/**
 * API Traffic Monitor Component
 * Burp Suite inspired request/response viewer
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useVehicleStore } from '../../stores/vehicleStore';
import { Activity, ArrowRight, Clock } from 'lucide-react';
import './APITrafficMonitor.css';

export const APITrafficMonitor: React.FC = () => {
  const apiLogs = useVehicleStore(s => s.apiLogs);
  const [selectedLog, setSelectedLog] = useState<number | null>(null);
  
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return '#38BDF8';
      case 'POST': return '#10B981';
      case 'PUT': return '#F59E0B';
      case 'DELETE': return '#EF4444';
      default: return '#9CA3AF';
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#10B981';
      case 'attack': return '#EF4444';
      case 'warning': return '#F59E0B';
      default: return '#6D28D9';
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
    <div className="api-traffic-monitor">
      <div className="monitor-header">
        <div className="header-left">
          <Activity className="w-5 h-5" />
          <h3>API Traffic Monitor</h3>
        </div>
        <div className="header-right">
          <span className="traffic-count">{apiLogs.length} requests</span>
        </div>
      </div>
      
      <div className="monitor-content">
        {/* Request List */}
        <div className="request-list">
          <AnimatePresence initial={false}>
            {apiLogs.length === 0 ? (
              <div className="empty-state">
                <Activity className="w-12 h-12 text-gray-600" />
                <p>No API traffic yet</p>
                <span>Requests will appear here in real-time</span>
              </div>
            ) : (
              apiLogs.map((log, index) => (
                <motion.div
                  key={`${log.timestamp}-${index}`}
                  className={`request-item ${selectedLog === index ? 'selected' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedLog(index)}
                >
                  <div className="request-header">
                    <span 
                      className="method-badge"
                      style={{ backgroundColor: getMethodColor(log.method) }}
                    >
                      {log.method}
                    </span>
                    <span className="endpoint">{log.endpoint}</span>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: log.status >= 200 && log.status < 300 ? '#10B981' : '#EF4444'
                      }}
                    >
                      {log.status}
                    </span>
                  </div>
                  <div className="request-meta">
                    {log.transaction_id && (
                      <span className="transaction-id" style={{ 
                        fontSize: '10px', 
                        color: '#A855F7',
                        fontFamily: 'monospace',
                        marginRight: '8px'
                      }}>
                        {log.transaction_id}
                      </span>
                    )}
                    <span className="timestamp">
                      <Clock className="w-3 h-3" />
                      {formatTime(log.timestamp)}
                    </span>
                    <span className="latency">{log.latency}ms</span>
                    <div 
                      className="type-indicator"
                      style={{ backgroundColor: getTypeColor(log.type) }}
                    />
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        
        {/* Request/Response Details */}
        {selectedLog !== null && apiLogs[selectedLog] && (
          <div className="request-details">
            <div className="details-header">
              <h4>Request Details</h4>
              <button 
                className="close-btn"
                onClick={() => setSelectedLog(null)}
              >
                ×
              </button>
            </div>
            
            <div className="details-content">
              {/* Request Panel */}
              <div className="detail-panel">
                <div className="panel-header">
                  <span>Request</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div className="panel-body">
                  <div className="detail-row">
                    <span className="label">Method:</span>
                    <span className="value">{apiLogs[selectedLog].method}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Endpoint:</span>
                    <span className="value mono">{apiLogs[selectedLog].endpoint}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Timestamp:</span>
                    <span className="value mono">{apiLogs[selectedLog].timestamp}</span>
                  </div>
                  {apiLogs[selectedLog].request && (
                    <div className="detail-row full">
                      <span className="label">Payload:</span>
                      <pre className="json-view">
                        {JSON.stringify(apiLogs[selectedLog].request, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Response Panel */}
              <div className="detail-panel">
                <div className="panel-header">
                  <ArrowRight className="w-4 h-4" />
                  <span>Response</span>
                </div>
                <div className="panel-body">
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span 
                      className="value"
                      style={{ 
                        color: apiLogs[selectedLog].status >= 200 && apiLogs[selectedLog].status < 300 
                          ? '#10B981' 
                          : '#EF4444'
                      }}
                    >
                      {apiLogs[selectedLog].status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Latency:</span>
                    <span className="value">{apiLogs[selectedLog].latency}ms</span>
                  </div>
                  {apiLogs[selectedLog].response && (
                    <div className="detail-row full">
                      <span className="label">Payload:</span>
                      <pre className="json-view">
                        {JSON.stringify(apiLogs[selectedLog].response, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
