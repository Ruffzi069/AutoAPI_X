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
  'replay': [
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Unlock Command', delay: 600 },
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Unlock Command (Replay #2)', delay: 900 },
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Unlock Command (Replay #3)', delay: 1200 },
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Unlock Command (Replay #4)', delay: 1500 },
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Unlock Command (Replay #5)', delay: 1800 }
  ],
  'idor': [
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Unauthorized Unlock', delay: 600 },
    { canId: '0x500', ecu: 'GPS ECU', event: 'Location Access', delay: 1200 },
    { canId: '0x330', ecu: 'Boot ECU', event: 'Unauthorized Boot Open', delay: 1800 }
  ],
  'broken-authentication': [
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Unlock Without Auth', delay: 600 },
    { canId: '0x320', ecu: 'Horn ECU', event: 'Horn Activation', delay: 1200 },
    { canId: '0x322', ecu: 'Lights ECU', event: 'Lights Flash', delay: 1800 },
    { canId: '0x400', ecu: 'Ignition ECU', event: 'Engine Start', delay: 2400 }
  ],
  'excessive-data-exposure': [
    { canId: '0x500', ecu: 'GPS ECU', event: 'Location Broadcast', delay: 600 },
    { canId: '0x500', ecu: 'GPS ECU', event: 'GPS Query', delay: 1200 },
    { canId: '0x500', ecu: 'GPS ECU', event: 'Telemetry Data', delay: 1800 },
    { canId: '0x500', ecu: 'GPS ECU', event: 'Location Query', delay: 2100 },
    { canId: '0x500', ecu: 'GPS ECU', event: 'Privacy Leak', delay: 2400 }
  ],
  'rate-limiting-failure': [
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Unlock Command', delay: 300 },
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Lock Command', delay: 400 },
    { canId: '0x320', ecu: 'Horn ECU', event: 'Horn Command', delay: 500 },
    { canId: '0x322', ecu: 'Lights ECU', event: 'Lights Command', delay: 600 },
    { canId: '0x500', ecu: 'GPS ECU', event: 'GPS Command', delay: 700 },
    { canId: '0x330', ecu: 'Boot ECU', event: 'Boot Command', delay: 800 },
    { canId: '0x321', ecu: 'Door Control ECU', event: 'Flood Frame', delay: 900 }
  ],
  'ota-manipulation': [
    { canId: '0x700', ecu: 'OTA ECU', event: 'Firmware Check', delay: 600 },
    { canId: '0x700', ecu: 'OTA ECU', event: 'Firmware Download', delay: 1800 },
    { canId: '0x700', ecu: 'OTA ECU', event: 'Malicious Install', delay: 3000 },
    { canId: '0x700', ecu: 'OTA ECU', event: 'Verify (Bypassed)', delay: 3500 },
    { canId: '0x600', ecu: 'Infotainment ECU', event: 'System Compromised', delay: 4000 }
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
