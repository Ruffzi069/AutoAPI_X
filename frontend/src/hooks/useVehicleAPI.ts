/**
 * Hook for vehicle API operations
 */

import { useState } from 'react';
import { vehicleAPI } from '../services/api';
import { useVehicleStore } from '../stores/vehicleStore';

export const useVehicleAPI = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const vin = useVehicleStore(s => s.vin);
  
  const executeAction = async (
    actionName: string,
    apiCall: () => Promise<any>
  ) => {
    setLoading(actionName);
    setError(null);
    
    try {
      const result = await apiCall();
      
      if (!result.success) {
        setError(result.message || 'Action failed');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error(`Error: ${actionName}`, err);
      return { success: false, error: errorMessage };
    } finally {
      setTimeout(() => setLoading(null), 1000);
    }
  };
  
  return {
    loading,
    error,
    lock: () => executeAction('lock', () => vehicleAPI.lock(vin)),
    unlock: () => executeAction('unlock', () => vehicleAPI.unlock(vin)),
    horn: () => executeAction('horn', () => vehicleAPI.horn(vin)),
    flashLights: () => executeAction('lights', () => vehicleAPI.flashLights(vin)),
    openBoot: () => executeAction('boot', () => vehicleAPI.openBoot(vin)),
    closeBoot: () => executeAction('closeBoot', () => vehicleAPI.closeBoot(vin)),
    startEngine: () => executeAction('start', () => vehicleAPI.startEngine(vin)),
    stopEngine: () => executeAction('stop', () => vehicleAPI.stopEngine(vin)),
    locate: () => executeAction('locate', () => vehicleAPI.locate(vin))
  };
};
