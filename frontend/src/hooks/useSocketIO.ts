/**
 * Hook for Socket.IO real-time updates
 * Handles vehicle, API, CAN, and event streams
 */

import { useEffect } from 'react';
import { initializeSocket } from '../services/socket';
import { useVehicleStore } from '../stores/vehicleStore';

export const useSocketIO = () => {
  const updateVehicleState = useVehicleStore(s => s.updateVehicleState);
  const addActivity = useVehicleStore(s => s.addActivity);
  const addSecurityEvent = useVehicleStore(s => s.addSecurityEvent);
  const addAPILog = useVehicleStore(s => s.addAPILog);
  const addCANFrame = useVehicleStore(s => s.addCANFrame);
  const addEventLog = useVehicleStore(s => s.addEventLog);
  
  useEffect(() => {
    const socket = initializeSocket();
    
    // Vehicle state updates
    socket.on('vehicle_updates', (data) => {
      console.log('Vehicle update received:', data);
      updateVehicleState(data);
      
      // Add activity log
      if (data.lastAction) {
        addActivity({
          timestamp: new Date().toISOString(),
          action: data.lastAction,
          type: 'info'
        });
      }
    });
    
    // API traffic updates
    socket.on('api_updates', (data) => {
      console.log('API Log:', data);
      addAPILog({
        transaction_id: data.transaction_id,
        timestamp: data.timestamp || new Date().toISOString(),
        method: data.method,
        endpoint: data.endpoint,
        request: data.request,
        response: data.response,
        status: data.status,
        latency: data.latency || 0,
        type: data.type || 'normal',
        source: data.source,
        user: data.user
      });
      
      // Add to activity feed
      addActivity({
        transaction_id: data.transaction_id,
        timestamp: new Date().toISOString(),
        action: `API ${data.method} ${data.endpoint}`,
        type: data.status >= 200 && data.status < 300 ? 'success' : 'error'
      });
    });
    
    // CAN frame updates
    socket.on('can_updates', (data) => {
      console.log('CAN Frame:', data);
      addCANFrame({
        transaction_id: data.transaction_id,
        timestamp: data.timestamp || new Date().toISOString(),
        can_id: data.can_id,
        source_ecu: data.source_ecu,
        destination_ecu: data.destination_ecu,
        payload: data.payload,
        message_type: data.message_type || 'command',
        severity: data.severity
      });
      
      // Add to activity feed
      addActivity({
        transaction_id: data.transaction_id,
        timestamp: new Date().toISOString(),
        action: `CAN ${data.can_id}: ${data.source_ecu} → ${data.destination_ecu}`,
        type: 'info'
      });
    });
    
    // Event updates
    socket.on('event_updates', (data) => {
      console.log('Event:', data);
      addEventLog({
        transaction_id: data.transaction_id,
        timestamp: data.timestamp || new Date().toISOString(),
        event_type: data.event_type,
        description: data.description,
        severity: data.severity || 'info'
      });
      
      // Add to activity feed
      addActivity({
        transaction_id: data.transaction_id,
        timestamp: new Date().toISOString(),
        action: data.description,
        type: data.severity || 'info'
      });
    });
    
    // Security events
    socket.on('security_event', (event) => {
      console.log('Security Event:', event);
      addSecurityEvent(event);
      
      addActivity({
        timestamp: new Date().toISOString(),
        action: `Security: ${event.message}`,
        type: 'error'
      });
    });
    
    return () => {
      socket.off('vehicle_updates');
      socket.off('can_updates');
      socket.off('api_updates');
      socket.off('event_updates');
      socket.off('security_event');
    };
  }, [updateVehicleState, addActivity, addSecurityEvent, addAPILog, addCANFrame, addEventLog]);
};
