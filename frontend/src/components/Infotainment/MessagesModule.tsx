import { useState, useEffect } from 'react';
import type { Message } from '../../types/vehicle.types';

export default function MessagesModule() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/infotainment/messages');
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/infotainment/messages/unread');
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.unread_count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontSize: '32px' }}>💬</span>
        <h2 style={{ flex: 1, margin: 0, fontSize: '24px', color: '#A855F7' }}>Messages</h2>
        {unreadCount > 0 && (
          <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: 'rgba(239,68,68,0.2)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
            {unreadCount} new
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ padding: '20px', background: msg.unread ? 'rgba(109,40,217,0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '12px', border: msg.unread ? '1px solid rgba(109,40,217,0.3)' : '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            {msg.unread && (
              <div style={{ position: 'absolute', top: '10px', right: '10px', width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#fff' }}>{msg.sender}</h4>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{msg.time}</span>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>{msg.preview}</p>
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>💬</div>
          <p style={{ margin: 0, fontSize: '16px' }}>No messages</p>
        </div>
      )}
    </div>
  );
}
