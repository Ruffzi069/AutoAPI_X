import { useState, useEffect } from 'react';
import type { WeatherState } from '../../types/vehicle.types';

export default function WeatherModule() {
  const [weather, setWeather] = useState<WeatherState | null>(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/infotainment/weather/current');
      const data = await response.json();
      if (data.success) {
        setWeather(data.weather);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  if (!weather) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontSize: '32px' }}>☁️</span>
        <h2 style={{ flex: 1, margin: 0, fontSize: '24px', color: '#A855F7' }}>Weather</h2>
      </div>

      <div style={{ textAlign: 'center', padding: '40px', background: 'linear-gradient(135deg, rgba(109,40,217,0.1), rgba(168,85,247,0.05))', borderRadius: '16px', border: '2px solid rgba(109,40,217,0.3)', marginBottom: '20px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>{weather.icon}</div>
        <div style={{ fontSize: '48px', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>{weather.temperature}°F</div>
        <div style={{ fontSize: '20px', color: '#A855F7', marginBottom: '5px' }}>{weather.condition}</div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>{weather.location}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '5px' }}>💧</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#fff' }}>{weather.humidity}%</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Humidity</div>
        </div>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '5px' }}>💨</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#fff' }}>{weather.wind_speed} mph</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Wind Speed</div>
        </div>
      </div>
    </div>
  );
}
