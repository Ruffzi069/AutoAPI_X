/**
 * CAN Activity Panel
 * Live CAN frame stream during attack execution
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Attack } from '../../pages/AttackSimulation';
import './CANActivityPanel.css';

interface CANEvent {
  id: string;
  timestamp: string;
  canId: string;
  ecu: string;
  event: string;
  transactionId: string;
}

interface CANActivityPanelProps {
  attack: Attack | null;
  isExecuting: boolean;
  executionCount: number;
}

const attackCANSequences: Record<string, Array<{canId: string, ecu: string, event: string, delay: number}>> = {
  'idor': [
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Unauthorized Unlock', delay: 600 },
    { canId: '0x327', ecu: 'GPS ECU', event: 'Location Access', delay: 1200 },
    { canId: '0x2C1', ecu: 'Gateway ECU', event: 'State Query', delay: 1800 }
  ],
  'broken-auth': [
    { canId: '0x320', ecu: 'Body Control ECU', event: 'Horn Activation', delay: 600 },
    { canId: '0x320', ecu: 'Body Control ECU', event: 'Lights Control', delay: 1200 },
    { canId: '0x400', ecu: 'Infotainment ECU', event: 'Media Playback', delay: 1800 }
  ],
  'replay-attack': [
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Unlock Command', delay: 600 },
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Unlock Command (Replay)', delay: 900 },
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Unlock Command (Replay)', delay: 1200 },
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Unlock Command (Replay)', delay: 1500 }
  ],
  'data-exposure': [
    { canId: '0x327', ecu: 'GPS ECU', event: 'Location Broadcast', delay: 600 },
    { canId: '0x3B2', ecu: 'Telemetry ECU', event: 'Data Exposure', delay: 1200 },
    { canId: '0x2C1', ecu: 'Gateway ECU', event: 'Privacy Leak', delay: 1800 }
  ],
  'rate-limiting': [
    { canId: '0x320', ecu: 'Body Control ECU', event: 'Horn Command', delay: 300 },
    { canId: '0x320', ecu: 'Body Control ECU', event: 'Horn Command', delay: 400 },
    { canId: '0x320', ecu: 'Body Control ECU', event: 'Horn Command', delay: 500 },
    { canId: '0x320', ecu: 'Body Control ECU', event: 'Horn Command', delay: 600 },
    { canId: '0x320', ecu: 'Body Control ECU', event: 'Horn Command', delay: 700 },
    { canId: '0x320', ecu: 'Body Control ECU', event: 'Horn Command', delay: 800 }
  ],
  'ota-manipulation': [
    { canId: '0x400', ecu: 'Infotainment ECU', event: 'Firmware Check', delay: 600 },
    { canId: '0x400', ecu: 'Infotainment ECU', event: 'Firmware Download', delay: 1800 },
    { canId: '0x400', ecu: 'Infotainment ECU', event: 'Malicious Firmware Install', delay: 3000 }
  ]
};

export const CANActivityPanel: React.FC<CANActivityPanelProps> = ({
  attack,
  isExecuting,
  executionCount
}) => {
  const [events, setEvents] = useState<CANEvent[]>([]);

  useEffect(() => {
    if (isExecuting && attack) {
      setEvents([]);
      const sequence = attackCANSequences[attack.id] || [];
      const txnId = `TXN-ATT-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

      sequence.forEach((item, index) => {
        setTimeout(() => {
          const event: CANEvent = {
            id: `${executionCount}-${index}`,
            timestamp: new Date().toLocaleTimeString(),
            canId: item.canId,
            ecu: item.ecu,
            event: item.event,
            transactionId: txnId
          };
          setEvents(prev => [...prev, event]);
        }, item.delay);
      });
    }
  }, [isExecuting, attack, executionCount]);

  return (
    <div className="can-activity-panel">
      <div className="panel-header">
        <h3>
          <span className="panel-icon">🚗</span>
          CAN Activity
        </h3>
      </div>

      <div className="activity-stream">
        {events.length === 0 ? (
          <div className="empty-stream">
            <span className="empty-icon">🚗</span>
            <p>Waiting for attack execution...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {events.map((event) => (
              <motion.div
                key={event.id}
                className="can-event"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="event-time">{event.timestamp}</div>
                <div className="event-can">
                  <span className="can-id-badge">{event.canId}</span>
                  <span className="ecu-name">{event.ecu}</span>
                </div>
                <div className="event-description">{event.event}</div>
                <div className="event-txn">TXN: {event.transactionId}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
