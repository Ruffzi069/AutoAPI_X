import { useState, useEffect } from 'react';
import type { PhoneState, CallHistory } from '../../types/vehicle.types';

export default function PhoneModule() {
  const [phone, setPhone] = useState<PhoneState | null>(null);
  const [calls, setCalls] = useState<CallHistory[]>([]);

  useEffect(() => {
    fetchPhoneStatus();
    fetchCalls();
  }, []);

  const fetchPhoneStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/infotainment/phone/status');
      const data = await response.json();
      if (data.success) {
        setPhone(data.state);
      }
    } catch (error) {
      console.error('Error fetching phone status:', error);
    }
  };

  const fetchCalls = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/infotainment/phone/calls');
      const data = await response.json();
      if (data.success) {
        setCalls(data.calls);
      }
    } catch (error) {
      console.error('Error fetching calls:', error);
    }
  };

  if (!phone) return <div>Loading...</div>;

  const getCallIcon = (type: string) => {
    if (type === 'incoming') return '📞';
    if (type === 'outgoing') return '📱';
    return '📵';
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontSize: '32px' }}>📱</span>
        <h2 style={{ flex: 1, margin: 0, fontSize: '24px', color: '#A855F7' }}>Phone</h2>
        <span style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', background: phone.connected ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: phone.connected ? '#10B981' : '#EF4444', border: phone.connected ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)' }}>
          {phone.connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {phone.connected && (
        <>
          <div style={{ padding: '25px', background: 'rgba(109,40,217,0.1)', borderRadius: '16px', border: '1px solid rgba(109,40,217,0.3)', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📱</div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#fff' }}>{phone.device_name}</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '15px' }}>
              <div>
                <div style={{ fontSize: '24px' }}>🔋</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '5px' }}>{phone.battery}%</div>
              </div>
              <div>
                <div style={{ fontSize: '24px' }}>📶</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '5px' }}>{'▮'.repeat(phone.signal_strength)}</div>
              </div>
            </div>
          </div>

          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>Recent Calls</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {calls.map((call, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '24px' }}>{getCallIcon(call.type)}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: '500', color: '#fff' }}>{call.name}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{call.number}</p>
                </div>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{call.time}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
