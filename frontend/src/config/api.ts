/**
 * API Configuration
 * Centralized API endpoint configuration
 */

// Use environment variable or fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Vehicle endpoints
  vehicles: {
    list: `${API_BASE_URL}/api/vehicles`,
    byVin: (vin: string) => `${API_BASE_URL}/api/vehicles/${vin}`,
    lock: (vin: string) => `${API_BASE_URL}/api/vehicles/${vin}/lock`,
    unlock: (vin: string) => `${API_BASE_URL}/api/vehicles/${vin}/unlock`,
    horn: (vin: string) => `${API_BASE_URL}/api/vehicles/${vin}/horn`,
    lightsFlash: (vin: string) => `${API_BASE_URL}/api/vehicles/${vin}/lights/flash`,
    engineStart: (vin: string) => `${API_BASE_URL}/api/vehicles/${vin}/engine/start`,
    engineStop: (vin: string) => `${API_BASE_URL}/api/vehicles/${vin}/engine/stop`,
    bootOpen: (vin: string) => `${API_BASE_URL}/api/vehicles/${vin}/boot/open`,
    bootClose: (vin: string) => `${API_BASE_URL}/api/vehicles/${vin}/boot/close`,
    locate: (vin: string) => `${API_BASE_URL}/api/vehicles/${vin}/locate`,
  },
  
  // Attack simulation endpoints
  attacks: {
    list: `${API_BASE_URL}/api/attacks/list`,
    replay: `${API_BASE_URL}/api/attacks/replay`,
    idor: `${API_BASE_URL}/api/attacks/idor`,
    brokenAuth: `${API_BASE_URL}/api/attacks/broken-authentication`,
    dataExposure: `${API_BASE_URL}/api/attacks/excessive-data-exposure`,
    rateLimiting: `${API_BASE_URL}/api/attacks/rate-limiting-failure`,
    otaManipulation: `${API_BASE_URL}/api/attacks/ota-manipulation`,
    status: (attackId: string) => `${API_BASE_URL}/api/attacks/status/${attackId}`,
  },
  
  // System endpoints
  system: {
    status: `${API_BASE_URL}/api/system/status`,
  },
  
  // Media endpoints
  media: {
    play: (vin: string) => `${API_BASE_URL}/api/media/${vin}/play`,
    pause: (vin: string) => `${API_BASE_URL}/api/media/${vin}/pause`,
    next: (vin: string) => `${API_BASE_URL}/api/media/${vin}/next`,
    previous: (vin: string) => `${API_BASE_URL}/api/media/${vin}/previous`,
    volumeUp: (vin: string) => `${API_BASE_URL}/api/media/${vin}/volume/up`,
    volumeDown: (vin: string) => `${API_BASE_URL}/api/media/${vin}/volume/down`,
  },
  
  // Infotainment endpoints
  infotainment: {
    navStart: (vin: string) => `${API_BASE_URL}/api/infotainment/${vin}/navigation/start`,
    navStop: (vin: string) => `${API_BASE_URL}/api/infotainment/${vin}/navigation/stop`,
    phoneSync: (vin: string) => `${API_BASE_URL}/api/infotainment/${vin}/phone/sync`,
    phoneDisconnect: (vin: string) => `${API_BASE_URL}/api/infotainment/${vin}/phone/disconnect`,
    otaCheck: (vin: string) => `${API_BASE_URL}/api/infotainment/${vin}/ota/check`,
    otaDownload: (vin: string) => `${API_BASE_URL}/api/infotainment/${vin}/ota/download`,
    otaInstall: (vin: string) => `${API_BASE_URL}/api/infotainment/${vin}/ota/install`,
  }
};

// Helper function to get attack endpoint by attack ID
export const getAttackEndpoint = (attackId: string): string => {
  const attackEndpoints: Record<string, string> = {
    'replay': API_ENDPOINTS.attacks.replay,
    'idor': API_ENDPOINTS.attacks.idor,
    'broken-authentication': API_ENDPOINTS.attacks.brokenAuth,
    'excessive-data-exposure': API_ENDPOINTS.attacks.dataExposure,
    'rate-limiting-failure': API_ENDPOINTS.attacks.rateLimiting,
    'ota-manipulation': API_ENDPOINTS.attacks.otaManipulation,
  };
  
  return attackEndpoints[attackId] || API_ENDPOINTS.attacks.replay;
};
