import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const socketHandler = (io: Server) => {
    // Middleware for authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            // Store user info in socket instance
            (socket as any).user = decoded;
            next();
        } catch (err) {
            next(new Error("Authentication error"));
        }
    });

    io.on('connection', async (socket: Socket) => {
        const user = (socket as any).user;
        console.log(`User connected: ${user.username} (${user.id})`);

        // Mark online
        try {
            await User.findByIdAndUpdate(user.id, { isOnline: true });
        } catch (e) {
            console.error('Error updating status', e);
        }

        // Join a room named after the user's ID for private messaging
        socket.join(user.id);

        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${user.username}`);
            try {
                await User.findByIdAndUpdate(user.id, { isOnline: false, lastActive: new Date() });
            } catch (e) {
                console.error('Error updating status on disconnect', e);
            }
        });

        // We don't really need 'send_message' listener if we use REST/GraphQL to send.
        // But if we want to emit from client, we can.
        // Better pattern: GraphQL resolver emits it via io instance.

        // Let's allow client to emit 'private_message' just in case, but usually backend drives this.
        socket.on('send_message', (data: any) => {
            // This is now legacy or for broadcast testing
        });
    });
};
