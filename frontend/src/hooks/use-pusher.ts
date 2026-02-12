import { useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { useAuth } from '@/contexts/AuthContext';
import { env } from '@/lib/env';

const PUSHER_KEY = env.PUSHER_KEY;
const PUSHER_CLUSTER = env.PUSHER_CLUSTER;

export function usePusher() {
    const { user } = useAuth();
    const pusherRef = useRef<Pusher | null>(null);

    useEffect(() => {
        if (user && !pusherRef.current && PUSHER_KEY && PUSHER_CLUSTER) {
            pusherRef.current = new Pusher(PUSHER_KEY, {
                cluster: PUSHER_CLUSTER,
            });

            // Optional: Log connection status
            pusherRef.current.connection.bind('connected', () => {
                console.log('Pusher connected');
            });
            pusherRef.current.connection.bind('error', (err: any) => {
                console.error('Pusher connection error:', err);
            });
        }

        return () => {
            if (pusherRef.current && !user) {
                pusherRef.current.disconnect();
                pusherRef.current = null;
            }
        };
    }, [user]);

    return pusherRef.current;
}
