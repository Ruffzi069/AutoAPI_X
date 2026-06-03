import { useState, useEffect } from 'react';
import type { NavigationState, ChargerLocation } from '../../types/vehicle.types';
import './MapsModule.css';

export default function MapsModule() {
  const [navState, setNavState] = useState<NavigationState | null>(null);
  const [chargers, setChargers] = useState<ChargerLocation[]>([]);

  useEffect(() => {
    fetchNavStatus();
    fetchChargers();
  }, []);

  const fetchNavStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/infotainment/navigation/status');
      const data = await response.json();
      if (data.success) {
        setNavState(data.state);
      }
    } catch (error) {
      console.error('Error fetching nav status:', error);
    }
  };

  const fetchChargers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/infotainment/navigation/chargers');
      const data = await response.json();
      if (data.success) {
        setChargers(data.chargers);
      }
    } catch (error) {
      console.error('Error fetching chargers:', error);
    }
  };

  const startNavigation = async (destination: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/infotainment/navigation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: '5YJ3E1EA1KF000001', destination })
      });
      const data = await response.json();
      if (data.success) {
        setNavState(data.state);
      }
    } catch (error) {
      console.error('Error starting navigation:', error);
    }
  };

  const stopNavigation = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/infotainment/navigation/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: '5YJ3E1EA1KF000001' })
      });
      const data = await response.json();
      if (data.success) {
        setNavState(data.state);
      }
    } catch (error) {
      console.error('Error stopping navigation:', error);
    }
  };

  if (!navState) {
    return <div className="maps-loading">Loading...</div>;
  }

  return (
    <div className="maps-module">
      <div className="maps-header">
        <span className="maps-icon">🗺️</span>
        <h2>Maps & Navigation</h2>
        <span className={`nav-badge ${navState.is_navigating ? 'active' : ''}`}>
          {navState.is_navigating ? 'Navigating' : 'Ready'}
        </span>
      </div>

      <div className="map-display">
        <div className="map-placeholder">
          <span className="map-icon">🗺️</span>
          <p>Map View</p>
          {navState.is_navigating && (
            <div className="route-line"></div>
          )}
        </div>
      </div>

      <div className="location-info">
        <div className="info-card">
          <span className="info-icon">📍</span>
          <div>
            <p className="info-label">Current Location</p>
            <p className="info-value">{navState.current_location}</p>
          </div>
        </div>

        {navState.is_navigating && (
          <>
            <div className="info-card">
              <span className="info-icon">🎯</span>
              <div>
                <p className="info-label">Destination</p>
                <p className="info-value">{navState.destination}</p>
              </div>
            </div>

            <div className="nav-stats">
              <div className="stat">
                <span className="stat-value">{navState.distance} mi</span>
                <span className="stat-label">Distance</span>
              </div>
              <div className="stat">
                <span className="stat-value">{navState.eta}</span>
                <span className="stat-label">ETA</span>
              </div>
            </div>
          </>
        )}
      </div>

      {navState.is_navigating ? (
        <button className="nav-button stop" onClick={stopNavigation}>
          ■ Stop Navigation
        </button>
      ) : (
        <div className="quick-destinations">
          <h3>Quick Destinations</h3>
          <button className="dest-button" onClick={() => startNavigation('Golden Gate Park')}>
            🌳 Golden Gate Park
          </button>
          <button className="dest-button" onClick={() => startNavigation('San Francisco Airport')}>
            ✈️ San Francisco Airport
          </button>
          <button className="dest-button" onClick={() => startNavigation('Apple Park')}>
            🍎 Apple Park
          </button>
        </div>
      )}

      <div className="chargers-section">
        <h3>Nearby Superchargers</h3>
        <div className="chargers-list">
          {chargers.map((charger, idx) => (
            <div key={idx} className="charger-item">
              <span className="charger-icon">⚡</span>
              <div className="charger-info">
                <p className="charger-name">{charger.name}</p>
                <p className="charger-distance">{charger.distance} mi away</p>
              </div>
              <span className="charger-available">{charger.available} available</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
