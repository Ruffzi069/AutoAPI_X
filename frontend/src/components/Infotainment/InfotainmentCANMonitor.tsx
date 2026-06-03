/**
 * Infotainment CAN Activity Monitor
 * Dedicated telemetry panel for infotainment CAN bus observability
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import './InfotainmentCANMonitor.css';

interface CANFrame {
  timestamp: string;
  canId: string;
  sourceECU: string;
  destinationECU: string;
  payload: string;
  eventType: string;
  transactionId?: string;
}

export const InfotainmentCANMonitor: React.FC = () => {
  const [canFrames, setCanFrames] = useState<CANFrame[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Connect to Socket.IO for real-time CAN updates
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });
    
    socket.on('connect', () => {
      console.log('CAN Monitor connected to Socket.IO');
    });

    socket.on('can_updates', (data) => {
      if (isInfotainmentCAN(data.can_id)) {
        const frame: CANFrame = {
          timestamp: data.timestamp,
          canId: data.can_id,
          sourceECU: data.source_ecu,
          destinationECU: data.destination_ecu,
          payload: data.payload,
          eventType: data.message_type || 'command',
          transactionId: data.transaction_id
        };
        addCANFrame(frame);
      }
    });

    socket.on('disconnect', () => {
      console.log('CAN Monitor disconnected from Socket.IO');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const isInfotainmentCAN = (canId: string): boolean => {
    // Infotainment ECUs: 0x400 (Infotainment Unit), 0x327 (GPS/Navigation)
    const infotainmentIds = ['0x400', '0x327', '0x401', '0x402'];
    return infotainmentIds.includes(canId);
  };

  const addCANFrame = (frame: CANFrame) => {
    setCanFrames(prev => [frame, ...prev].slice(0, 50)); // Keep last 50 frames
  };

  const getECUName = (canId: string): string => {
    const ecuMap: Record<string, string> = {
      '0x400': 'Infotainment Unit',
      '0x327': 'GPS Module',
      '0x401': 'Audio Subsystem',
      '0x402': 'Connectivity Module'
    };
    return ecuMap[canId] || 'Unknown ECU';
  };

  const getEventIcon = (eventType: string): string => {
    const icons: Record<string, string> = {
      'Media Playback Start': '▶️',
      'Media Playback Pause': '⏸️',
      'Media Next': '⏭️',
      'Media Previous': '⏮️',
      'Volume Change': '🔊',
      'Route Generated': '🗺️',
      'Location Update': '📍',
      'Weather Retrieved': '☁️',
      'OTA Update': '⬇️',
      'Phone Connected': '📱',
      'Message Sync': '💬'
    };
    return icons[eventType] || '📡';
  };

  const filteredFrames = filter === 'all'
    ? canFrames
    : canFrames.filter(frame => {
        if (filter === 'media') return frame.eventType.includes('Media');
        if (filter === 'navigation') return frame.eventType.includes('Route') || frame.eventType.includes('Location');
        if (filter === 'weather') return frame.eventType.includes('Weather');
        return true;
      });

  const formatPayload = (payload: string): string => {
    // Format hex payload for readability
    return payload.match(/.{1,2}/g)?.join(' ') || payload;
  };

  return (
    <div className="infotainment-can-monitor">
      <div className="monitor-header">
        <div className="header-left">
          <h3>
            <span className="header-icon">🚗</span>
            Infotainment CAN Activity
          </h3>
          <span className="frame-count">{filteredFrames.length} frames</span>
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

      <div className="can-frames-container">
        {filteredFrames.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🚗</span>
            <p>No infotainment CAN activity yet</p>
            <p className="empty-subtext">CAN frames will appear when infotainment services are used</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredFrames.map((frame, index) => (
              <motion.div
                key={`${frame.timestamp}-${index}`}
                className="can-frame-entry"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="frame-main">
                  <div className="frame-time">
                    {new Date(frame.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="frame-can-id">
                    <span className="can-id-badge">{frame.canId}</span>
                  </div>
                  <div className="frame-ecu">
                    <div className="ecu-flow">
                      <span className="ecu-name source">{getECUName(frame.canId)}</span>
                      <span className="arrow">→</span>
                      <span className="ecu-name dest">{frame.destinationECU}</span>
                    </div>
                  </div>
                  <div className="frame-event">
                    <span className="event-icon">{getEventIcon(frame.eventType)}</span>
                    <span className="event-type">{frame.eventType}</span>
                  </div>
                </div>

                <div className="frame-payload">
                  <span className="payload-label">Payload:</span>
                  <span className="payload-data">{formatPayload(frame.payload)}</span>
                </div>

                {frame.transactionId && (
                  <div className="frame-transaction">
                    <span className="txn-label">TXN:</span>
                    <span className="txn-id">{frame.transactionId}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
