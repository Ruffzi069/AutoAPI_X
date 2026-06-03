/**
 * CAN Traffic Monitor Component
 * Real-time CAN frame streaming
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useVehicleStore } from '../../stores/vehicleStore';
import { Radio, Clock } from 'lucide-react';
import './CANTrafficMonitor.css';

export const CANTrafficMonitor: React.FC = () => {
  const canFrames = useVehicleStore(s => s.canFrames);
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };
  
  const getECUColor = (ecu: string) => {
    if (ecu.includes('Gateway')) return '#A855F7';
    if (ecu.includes('Door')) return '#10B981';
    if (ecu.includes('Horn')) return '#F59E0B';
    if (ecu.includes('Boot')) return '#38BDF8';
    if (ecu.includes('Ignition')) return '#EF4444';
    if (ecu.includes('Lights')) return '#FBBF24';
    if (ecu.includes('GPS')) return '#06B6D4';
    if (ecu.includes('Infotainment')) return '#8B5CF6';
    return '#6B7280';
  };
  
  return (
    <div className="can-traffic-monitor">
      <div className="monitor-header">
        <div className="header-left">
          <Radio className="w-5 h-5" />
          <h3>CAN Traffic Monitor</h3>
        </div>
        <div className="header-right">
          <span className="traffic-count">{canFrames.length} frames</span>
          <span className="interface-badge">vcan0</span>
        </div>
      </div>
      
      <div className="monitor-content">
        <div className="can-table">
          <div className="table-header">
            <div className="col-time">Timestamp</div>
            <div className="col-id">CAN ID</div>
            <div className="col-source">Source ECU</div>
            <div className="col-dest">Destination ECU</div>
            <div className="col-payload">Payload</div>
            <div className="col-type">Type</div>
          </div>
          
          <div className="table-body">
            <AnimatePresence initial={false}>
              {canFrames.length === 0 ? (
                <div className="empty-state">
                  <Radio className="w-12 h-12 text-gray-600" />
                  <p>No CAN traffic yet</p>
                  <span>Frames will appear here in real-time</span>
                </div>
              ) : (
                canFrames.map((frame, index) => (
                  <motion.div
                    key={`${frame.timestamp}-${index}`}
                    className="table-row"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="col-time">
                      <Clock className="w-3 h-3" />
                      {formatTime(frame.timestamp)}
                      {frame.transaction_id && (
                        <span style={{ 
                          display: 'block', 
                          fontSize: '9px', 
                          color: '#A855F7', 
                          fontFamily: 'monospace',
                          marginTop: '2px'
                        }}>
                          {frame.transaction_id}
                        </span>
                      )}
                    </div>
                    <div className="col-id">
                      <span className="can-id-badge">{frame.can_id}</span>
                    </div>
                    <div className="col-source">
                      <span 
                        className="ecu-badge"
                        style={{ backgroundColor: getECUColor(frame.source_ecu) }}
                      >
                        {frame.source_ecu}
                      </span>
                    </div>
                    <div className="col-dest">
                      <span 
                        className="ecu-badge"
                        style={{ backgroundColor: getECUColor(frame.destination_ecu) }}
                      >
                        {frame.destination_ecu}
                      </span>
                    </div>
                    <div className="col-payload">
                      <code className="payload-code">{frame.payload}</code>
                    </div>
                    <div className="col-type">
                      <span className="type-badge">{frame.message_type}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
