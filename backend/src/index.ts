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
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Context } from 'graphql-ws';

import connectDB from './config/db';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { socketHandler } from './socket';
import { initKronos } from './jobs/cron';
import { initNotificationService } from './services/notification.service';
import blogRoutes from './routes/BlogRoutes';
import blogCategoryRoutes from './routes/BlogCategoryRoutes';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const startServer = async () => {
    // Start Cron Jobs
    initKronos();

    const app = express();
    const httpServer = http.createServer(app);

    // Connect to Database
    await connectDB();

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    // WebSocket Server Setup
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    const serverCleanup = useServer({
        schema,
        context: async (ctx: Context) => {
            const token = ctx.connectionParams?.authorization as string || '';
            let user = null;
            if (token) {
                try {
                    user = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'secret');
                } catch (e) {
                    // Invalid token
                }
            }
            return { user };
        }
    }, wsServer);

    // Apollo Server Setup
    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
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
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'];
    app.use(cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }));

    // Global Body Parser
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    // Auth Middleware for all routes
    app.use(authMiddleware);

    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({ req }: any) => {
                return { user: req.user, io }; // Use user from middleware
            },
        }) as unknown as express.RequestHandler,
    );

    // REST API Routes
    app.use('/api/blogs', blogRoutes);
    app.use('/api/blog-categories', blogCategoryRoutes);

    const PORT = process.env.PORT || 4000;

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
        console.log(`🔌 Socket.io ready on port ${PORT}`);
    });
};

startServer();
