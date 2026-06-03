import { useState, useEffect } from 'react';
import type { OTAState } from '../../types/vehicle.types';

export default function OTACenter() {
  const [ota, setOta] = useState<OTAState | null>(null);

  useEffect(() => {
    fetchOTAStatus();
  }, []);

  const fetchOTAStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/infotainment/ota/status');
      const data = await response.json();
      if (data.success) {
        setOta(data.state);
      }
    } catch (error) {
      console.error('Error fetching OTA status:', error);
    }
  };

  const checkUpdates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/infotainment/ota/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: '5YJ3E1EA1KF000001' })
      });
      const data = await response.json();
      if (data.success) {
        setOta(data.state);
      }
    } catch (error) {
      console.error('Error checking updates:', error);
    }
  };

  const downloadUpdate = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/infotainment/ota/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: '5YJ3E1EA1KF000001' })
      });
      const data = await response.json();
      if (data.success) {
        setOta(data.state);
      }
    } catch (error) {
      console.error('Error downloading update:', error);
    }
  };

  const installUpdate = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/infotainment/ota/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: '5YJ3E1EA1KF000001' })
      });
      const data = await response.json();
      if (data.success) {
        setOta(data.state);
      }
    } catch (error) {
      console.error('Error installing update:', error);
    }
  };

  if (!ota) return <div>Loading...</div>;

  const getStatusColor = () => {
    if (ota.status === 'downloading') return '#F59E0B';
    if (ota.status === 'installing') return '#EF4444';
    return '#10B981';
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontSize: '32px' }}>⬇️</span>
        <h2 style={{ flex: 1, margin: 0, fontSize: '24px', color: '#A855F7' }}>OTA Update Center</h2>
        <span style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', background: `rgba(${ota.status === 'idle' ? '16,185,129' : '245,158,11'},0.2)`, color: getStatusColor(), border: `1px solid rgba(${ota.status === 'idle' ? '16,185,129' : '245,158,11'},0.3)` }}>
          {ota.status}
        </span>
      </div>

      <div style={{ padding: '25px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <div>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Current Version</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#fff' }}>{ota.current_version}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Available</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#10B981' }}>{ota.available_version}</p>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>Size: {ota.update_size}</p>
      </div>

      {ota.update_available && (
        <div style={{ padding: '20px', background: 'rgba(109,40,217,0.1)', borderRadius: '12px', border: '1px solid rgba(109,40,217,0.3)', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#A855F7' }}>📦 What's New</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255,255,255,0.7)' }}>
            {ota.release_notes.map((note, idx) => (
              <li key={idx} style={{ marginBottom: '8px', fontSize: '14px' }}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {ota.status === 'downloading' && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
            <span>Downloading...</span>
            <span>{ota.download_progress}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${ota.download_progress}%`, height: '100%', background: 'linear-gradient(90deg, #6D28D9, #A855F7)', transition: 'width 0.3s ease' }}></div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={checkUpdates} style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
          Check for Updates
        </button>
        {ota.update_available && ota.status === 'idle' && (
          <>
            <button onClick={downloadUpdate} style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'linear-gradient(135deg, #6D28D9, #A855F7)', border: 'none', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Download Update
            </button>
          </>
        )}
        {ota.status === 'downloading' && ota.download_progress === 100 && (
          <button onClick={installUpdate} style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            Install Now
          </button>
        )}
      </div>
    </div>
  );
}
