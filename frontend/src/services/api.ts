/**
 * API service for AutoAPI-X backend communication
 */

const API_BASE = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  
  // Check if response is JSON
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response received:', text.substring(0, 200));
    throw new Error(`Server returned ${response.status}: Expected JSON but got ${contentType || 'unknown type'}`);
  }
  
  // Parse JSON
  try {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON response from server');
    }
    throw error;
  }
};

// Helper function to make API calls with error handling
const apiCall = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error [${url}]:`, error);
    throw error;
  }
};

export const vehicleAPI = {
  // Get all vehicles
  getVehicles: async () => {
    return apiCall(`${API_BASE}/vehicles`);
  },
  
  // Get vehicle by VIN
  getVehicle: async (vin: string) => {
    return apiCall(`${API_BASE}/vehicles/${vin}`);
  },
  
  // Lock vehicle
  lock: async (vin: string) => {
    return apiCall(`${API_BASE}/vehicles/${vin}/lock`, {
      method: 'POST'
    });
  },
  
  // Unlock vehicle
  unlock: async (vin: string) => {
    return apiCall(`${API_BASE}/vehicles/${vin}/unlock`, {
      method: 'POST'
    });
  },
  
  // Horn
  horn: async (vin: string) => {
    return apiCall(`${API_BASE}/vehicles/${vin}/horn`, {
      method: 'POST'
    });
  },
  
  // Flash lights
  flashLights: async (vin: string) => {
    return apiCall(`${API_BASE}/vehicles/${vin}/lights/flash`, {
      method: 'POST'
    });
  },
  
  // Open boot
  openBoot: async (vin: string) => {
    return apiCall(`${API_BASE}/vehicles/${vin}/boot/open`, {
      method: 'POST'
    });
  },
  
  // Close boot
  closeBoot: async (vin: string) => {
    return apiCall(`${API_BASE}/vehicles/${vin}/boot/close`, {
      method: 'POST'
    });
  },
  
  // Start engine
  startEngine: async (vin: string) => {
    return apiCall(`${API_BASE}/vehicles/${vin}/engine/start`, {
      method: 'POST'
    });
  },
  
  // Stop engine
  stopEngine: async (vin: string) => {
    return apiCall(`${API_BASE}/vehicles/${vin}/engine/stop`, {
      method: 'POST'
    });
  },
  
  // Locate vehicle
  locate: async (vin: string) => {
    return apiCall(`${API_BASE}/vehicles/${vin}/locate`, {
      method: 'POST'
    });
  }
};
