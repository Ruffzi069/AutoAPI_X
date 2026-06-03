/**
 * Vehicle Reaction Panel
 * Live event stream with Tesla-style vehicle visualization
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Attack } from '../../pages/AttackSimulation';
import './VehicleReactionPanel.css';

interface VehicleReactionPanelProps {
  attack: Attack | null;
  isExecuting: boolean;
  executionCount: number;
}

interface VehicleEvent {
  id: string;
  timestamp: string;
  message: string;
  transactionId: string;
}

const attackEventSequences: Record<string, Array<{message: string, delay: number}>> = {
  'idor': [
    { message: 'Attack Started', delay: 100 },
    { message: 'API Request Generated', delay: 600 },
    { message: 'Unauthorized Door Unlock Command', delay: 700 },
    { message: 'CAN Frame 0x321 Sent', delay: 800 },
    { message: 'Door Control ECU Activated', delay: 900 },
    { message: 'Vehicle State Changed', delay: 1000 },
    { message: 'GPS Location Accessed', delay: 1600 },
    { message: 'Privacy Compromised', delay: 2000 },
    { message: 'Attack Completed', delay: 2500 }
  ],
  'broken-auth': [
    { message: 'Attack Started', delay: 100 },
    { message: 'API Request Without Auth', delay: 600 },
    { message: 'Authorization Bypassed', delay: 700 },
    { message: 'Horn Activation Command', delay: 800 },
    { message: 'CAN Frame 0x320 Sent', delay: 900 },
    { message: 'Body Control ECU Activated', delay: 1000 },
    { message: 'Lights Control Executed', delay: 1500 },
    { message: 'Remote Access Granted', delay: 2000 },
    { message: 'Attack Completed', delay: 2500 }
  ],
  'replay-attack': [
    { message: 'Attack Started', delay: 100 },
    { message: 'Command Capture Successful', delay: 500 },
    { message: 'Replaying Unlock Command #1', delay: 700 },
    { message: 'CAN Frame 0x321 Sent', delay: 800 },
    { message: 'Replaying Unlock Command #2', delay: 1000 },
    { message: 'CAN Frame 0x321 Sent', delay: 1100 },
    { message: 'Replaying Unlock Command #3', delay: 1300 },
    { message: 'CAN Frame 0x321 Sent', delay: 1400 },
    { message: 'ECU Confusion State', delay: 1800 },
    { message: 'Attack Completed', delay: 2000 }
  ],
  'data-exposure': [
    { message: 'Attack Started', delay: 100 },
    { message: 'API Request Generated', delay: 600 },
    { message: 'Excessive Data Response', delay: 800 },
    { message: 'GPS Location Data Exposed', delay: 900 },
    { message: 'CAN Frame 0x327 Captured', delay: 1000 },
    { message: 'Telemetry Data Leaked', delay: 1500 },
    { message: 'Privacy Violation', delay: 2000 },
    { message: 'Attack Completed', delay: 2500 }
  ],
  'rate-limiting': [
    { message: 'Attack Started', delay: 100 },
    { message: 'Flooding API Endpoint', delay: 300 },
    { message: 'Request #1 Sent', delay: 400 },
    { message: 'Request #2 Sent', delay: 500 },
    { message: 'Request #3 Sent', delay: 600 },
    { message: 'Request #4 Sent', delay: 700 },
    { message: 'Request #5 Sent', delay: 800 },
    { message: 'System Overload Detected', delay: 1000 },
    { message: 'Service Degradation', delay: 1500 },
    { message: 'Attack Completed', delay: 2000 }
  ],
  'ota-manipulation': [
    { message: 'Attack Started', delay: 100 },
    { message: 'OTA Check Initiated', delay: 600 },
    { message: 'Firmware Verification Bypassed', delay: 1200 },
    { message: 'Malicious Package Downloaded', delay: 1800 },
    { message: 'CAN Frame 0x400 Sent', delay: 2000 },
    { message: 'Infotainment ECU Compromised', delay: 2600 },
    { message: 'Firmware Installation Complete', delay: 3200 },
    { message: 'System Compromised', delay: 3500 },
    { message: 'Attack Completed', delay: 4000 }
  ]
};

const attackIndicatorTypes: Record<string, Array<'door' | 'gps' | 'network' | 'firmware' | 'horn' | 'lights'>> = {
  'idor': ['door', 'gps', 'network'],
  'broken-auth': ['horn', 'lights', 'network'],
  'replay-attack': ['door', 'door', 'door'],
  'data-exposure': ['gps', 'network'],
  'rate-limiting': ['network', 'horn'],
  'ota-manipulation': ['firmware', 'network']
};

export const VehicleReactionPanel: React.FC<VehicleReactionPanelProps> = ({
  attack,
  isExecuting,
  executionCount
}) => {
  const [events, setEvents] = useState<VehicleEvent[]>([]);
  const [activeIndicators, setActiveIndicators] = useState<Set<string>>(new Set());
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    if (isExecuting && attack) {
      const txnId = `TXN-ATT-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
      setTransactionId(txnId);
      setEvents([]);
      setActiveIndicators(new Set());
      
      const eventSequence = attackEventSequences[attack.id] || [];
      const indicators = attackIndicatorTypes[attack.id] || [];
      
      eventSequence.forEach((item, index) => {
        setTimeout(() => {
          const event: VehicleEvent = {
            id: `${executionCount}-${index}`,
            timestamp: new Date().toLocaleTimeString(),
            message: item.message,
            transactionId: txnId
          };
          setEvents(prev => [...prev, event]);
          
          // Activate vehicle indicators at key moments
          if (index < indicators.length) {
            setActiveIndicators(prev => new Set(prev).add(indicators[index]));
            setTimeout(() => {
              setActiveIndicators(prev => {
                const next = new Set(prev);
                next.delete(indicators[index]);
                return next;
              });
            }, 1500);
          }
        }, item.delay);
      });
    }
  }, [isExecuting, attack, executionCount]);

  const isIndicatorActive = (type: string) => activeIndicators.has(type);

  return (
    <div className="vehicle-reaction-panel">
      <div className="panel-header">
        <h3>
          <span className="panel-icon">🚗</span>
          Vehicle Reaction
        </h3>
        {transactionId && (
          <span className="transaction-badge">TXN: {transactionId}</span>
        )}
      </div>

      <div className="vehicle-visualization">
        <div className="vehicle-diagram">
          {/* Tesla Model 3 Side Profile */}
          <svg viewBox="0 0 800 350" className="vehicle-svg">
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2C3440" />
                <stop offset="50%" stopColor="#1A1F28" />
                <stop offset="100%" stopColor="#0F1318" />
              </linearGradient>
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3A4350" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1F2937" stopOpacity="0.7" />
              </linearGradient>
              <radialGradient id="wheelGrad">
                <stop offset="0%" stopColor="#3A4350" />
                <stop offset="70%" stopColor="#1F2937" />
                <stop offset="100%" stopColor="#0F1318" />
              </radialGradient>
            </defs>

            {/* Ground Shadow */}
            <ellipse cx="400" cy="295" rx="280" ry="15" fill="#000000" opacity="0.15" />

            {/* Main Body */}
            <path
              d="M 150,250 L 145,235 Q 140,220 145,210 L 160,185 Q 175,165 195,160 L 260,150 Q 285,145 305,142 L 330,139 Q 345,135 360,130 L 390,117 Q 410,108 435,106 L 560,106 Q 590,108 610,118 L 635,135 Q 645,150 650,170 L 655,195 Q 657,215 665,250 L 655,275 L 635,280 L 180,280 L 160,275 Z"
              fill="url(#bodyGrad)"
              stroke="#3A4350"
              strokeWidth="1.5"
            />

            {/* Windows */}
            <path
              d="M 340,137 L 410,110 L 520,110 L 560,127 L 560,165 L 340,165 Z"
              fill="url(#glassGrad)"
            />

            {/* Door - with indicator */}
            <motion.rect
              x="300" y="165" width="80" height="85" rx="3"
              fill="transparent"
              stroke={isIndicatorActive('door') ? '#EF4444' : 'transparent'}
              strokeWidth="3"
              animate={isIndicatorActive('door') ? { opacity: [0.3, 0.9, 0.3] } : {}}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />

            {/* Front Wheel */}
            <g>
              <circle cx="235" cy="280" r="35" fill="url(#wheelGrad)" stroke="#3A4350" strokeWidth="3" />
              <circle cx="235" cy="280" r="20" fill="#0F1318" />
            </g>

            {/* Rear Wheel */}
            <g>
              <circle cx="580" cy="280" r="35" fill="url(#wheelGrad)" stroke="#3A4350" strokeWidth="3" />
              <circle cx="580" cy="280" r="20" fill="#0F1318" />
            </g>

            {/* Headlight - with indicator */}
            <motion.ellipse
              cx="665" cy="215" rx="8" ry="10"
              fill={isIndicatorActive('lights') ? '#FBBF24' : '#4B5563'}
              animate={isIndicatorActive('lights') ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
            />

            {/* GPS Antenna - with indicator */}
            <motion.circle
              cx="400" cy="95" r="6"
              fill={isIndicatorActive('gps') ? '#F59E0B' : 'transparent'}
              stroke={isIndicatorActive('gps') ? '#F59E0B' : 'transparent'}
              strokeWidth="2"
              animate={isIndicatorActive('gps') ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
            />

            {/* Network/Connectivity Indicator */}
            <motion.path
              d="M 630,150 Q 635,145 640,150 M 625,155 Q 635,140 645,155"
              stroke={isIndicatorActive('network') ? '#3B82F6' : 'transparent'}
              strokeWidth="2.5"
              fill="none"
              animate={isIndicatorActive('network') ? { opacity: [0.3, 1, 0.3] } : {}}
              transition={{ repeat: Infinity, duration: 0.7 }}
            />

            {/* Infotainment/Firmware Indicator */}
            <motion.rect
              x="450" y="145" width="50" height="35" rx="3"
              fill="transparent"
              stroke={isIndicatorActive('firmware') ? '#A855F7' : 'transparent'}
              strokeWidth="3"
              animate={isIndicatorActive('firmware') ? { opacity: [0.3, 0.9, 0.3] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
            />

            {/* Horn Indicator (sound waves) */}
            <motion.g>
              {isIndicatorActive('horn') && (
                <>
                  <motion.circle
                    cx="180" cy="200" r="20"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                  />
                  <motion.circle
                    cx="180" cy="200" r="20"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                  />
                </>
              )}
            </motion.g>
          </svg>
        </div>

        <div className="event-stream">
          {events.length === 0 ? (
            <div className="empty-stream">
              <p>Awaiting attack execution...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {events.slice(-8).reverse().map((event) => (
                <motion.div
                  key={event.id}
                  className="stream-event"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="event-time">{event.timestamp}</span>
                  <span className="event-message">{event.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};
