import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

import connectDB from './config/db';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { socketHandler } from './socket';
import { initKronos } from './jobs/cron';
import { initNotificationService } from './services/notification.service';

dotenv.config();

const startServer = async () => {
    // Start Cron Jobs
    initKronos();

    const app = express();
    const httpServer = http.createServer(app);

    // Connect to Database
    await connectDB();

    // Apollo Server Setup
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    // Socket.io Setup
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    socketHandler(io);
    initNotificationService(io);

    // Middleware
    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        bodyParser.json({ limit: '50mb' }),
        expressMiddleware(server, {
            context: async ({ req }: any) => {
                const token = req.headers.authorization || '';
                let user = null;
                if (token) {
                    try {
                        user = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secret');
                    } catch (e) {
                        // Invalid token
                    }
                }
                return { user, io }; // Pass IO instance
            },
        }) as unknown as express.RequestHandler,
    );

    const PORT = process.env.PORT || 4000;

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
        console.log(`🔌 Socket.io ready on port ${PORT}`);
    });
};

startServer();
