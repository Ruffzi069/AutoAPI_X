/**
 * Socket.IO service for real-time updates
 */

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
    
    socket.on('connect', () => {
      console.log('✓ Connected to AutoAPI-X backend');
    });
    
    socket.on('disconnect', () => {
      console.log('✗ Disconnected from backend');
    });
    
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }
  
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
