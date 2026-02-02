import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

const SOCKET_URL = 'http://localhost:4000';

export function useSocket() {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Only connect if user is logged in
    const token = localStorage.getItem('token');
    
    if (user && token) {
      if (!socketRef.current) {
        socketRef.current = io(SOCKET_URL, {
          auth: {
            token: token
          }
        });

        socketRef.current.on('connect', () => {
          console.log('Connected to socket server');
        });

        socketRef.current.on('connect_error', (err) => {
          console.error('Socket connection error:', err.message);
        });
      }
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }

    return () => {
      // Don't disconnect on every re-render, only on logout or unmount
      // But for safety in React strict mode or HMR:
      // if (socketRef.current) {
      //   socketRef.current.disconnect();
      //   socketRef.current = null;
      // }
    };
  }, [user]);

  return socketRef.current;
}
