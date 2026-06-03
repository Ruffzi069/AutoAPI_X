/**
 * API Activity Panel
 * Live API request stream during attack execution
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Attack } from '../../pages/AttackSimulation';
import './APIActivityPanel.css';

interface APIEvent {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  transactionId: string;
}

interface APIActivityPanelProps {
  attack: Attack | null;
  isExecuting: boolean;
  executionCount: number;
}

const attackAPISequences: Record<string, Array<{method: string, endpoint: string, status: number, delay: number}>> = {
  'idor': [
    { method: 'POST', endpoint: '/api/vehicles/5YJ3E1EA1KF999999/unlock', status: 200, delay: 500 },
    { method: 'GET', endpoint: '/api/vehicles/5YJ3E1EA1KF999999/location', status: 200, delay: 1000 },
    { method: 'GET', endpoint: '/api/vehicles/5YJ3E1EA1KF999999/status', status: 200, delay: 1500 }
  ],
  'broken-auth': [
    { method: 'POST', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/horn', status: 200, delay: 500 },
    { method: 'POST', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/lights', status: 200, delay: 1000 },
    { method: 'POST', endpoint: '/api/media/play', status: 200, delay: 1500 }
  ],
  'replay-attack': [
    { method: 'POST', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/unlock', status: 200, delay: 500 },
    { method: 'POST', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/unlock', status: 200, delay: 800 },
    { method: 'POST', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/unlock', status: 200, delay: 1100 },
    { method: 'POST', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/unlock', status: 200, delay: 1400 }
  ],
  'data-exposure': [
    { method: 'GET', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/status', status: 200, delay: 500 },
    { method: 'GET', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/telemetry', status: 200, delay: 1000 },
    { method: 'GET', endpoint: '/api/infotainment/navigation/location', status: 200, delay: 1500 }
  ],
  'rate-limiting': [
    { method: 'POST', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/horn', status: 200, delay: 200 },
    { method: 'POST', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/horn', status: 200, delay: 300 },
    { method: 'POST', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/horn', status: 200, delay: 400 },
    { method: 'POST', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/horn', status: 200, delay: 500 },
    { method: 'POST', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/horn', status: 200, delay: 600 },
    { method: 'POST', endpoint: '/api/vehicles/5YJ3E1EA1KF000001/horn', status: 200, delay: 700 }
  ],
  'ota-manipulation': [
    { method: 'POST', endpoint: '/api/infotainment/ota/check', status: 200, delay: 500 },
    { method: 'POST', endpoint: '/api/infotainment/ota/download', status: 200, delay: 1500 },
    { method: 'POST', endpoint: '/api/infotainment/ota/install', status: 200, delay: 2500 }
  ]
};

export const APIActivityPanel: React.FC<APIActivityPanelProps> = ({
  attack,
  isExecuting,
  executionCount
}) => {
  const [events, setEvents] = useState<APIEvent[]>([]);

  useEffect(() => {
    if (isExecuting && attack) {
      setEvents([]);
      const sequence = attackAPISequences[attack.id] || [];
      const txnId = `TXN-ATT-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

      sequence.forEach((item, index) => {
        setTimeout(() => {
          const event: APIEvent = {
            id: `${executionCount}-${index}`,
            timestamp: new Date().toLocaleTimeString(),
            method: item.method,
            endpoint: item.endpoint,
            status: item.status,
            transactionId: txnId
          };
          setEvents(prev => [...prev, event]);
        }, item.delay);
      });
    }
  }, [isExecuting, attack, executionCount]);

  return (
    <div className="api-activity-panel">
      <div className="panel-header">
        <h3>
          <span className="panel-icon">📡</span>
          API Activity
        </h3>
      </div>

      <div className="activity-stream">
        {events.length === 0 ? (
          <div className="empty-stream">
            <span className="empty-icon">📡</span>
            <p>Waiting for attack execution...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {events.map((event) => (
              <motion.div
                key={event.id}
                className="api-event"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="event-time">{event.timestamp}</div>
                <div className="event-request">
                  <span className="method-badge">{event.method}</span>
                  <span className="endpoint">{event.endpoint}</span>
                </div>
                <div className="event-status success">{event.status} OK</div>
                <div className="event-txn">TXN: {event.transactionId}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
