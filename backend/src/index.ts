import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Context } from 'graphql-ws';

import connectDB from './config/db';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { initKronos } from './jobs/cron';
import blogRoutes from './routes/BlogRoutes';
import blogCategoryRoutes from './routes/BlogCategoryRoutes';
import uploadRoutes from './routes/UploadRoutes';
import teamRoutes from './routes/TeamRoutes';
import aiCourseRoutes from './routes/AICourseRoutes';
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
    console.log('🔌 Setting up WebSocket Server...');
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
    console.log('🛰️ Setting up Apollo Server...');
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
    console.log('✅ Apollo Server Started');

    // Middleware
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:8080').split(',').map(o => o.trim());
    console.log('CORS Allowed Origins:', allowedOrigins);

    // Consistently handle CORS and Preflight
    app.use((req, res, next) => {
        const origin = req.headers.origin;
        const isAllowed = !origin || allowedOrigins.includes(origin);

        if (req.method === 'OPTIONS') {
            console.log(`[CORS DEBUG] Preflight Request - Origin: ${origin}, Allowed: ${isAllowed}`);
            console.log(`[CORS DEBUG] Headers: ${JSON.stringify(req.headers, null, 2)}`);

            if (isAllowed) {
                res.header('Access-Control-Allow-Origin', origin);
                res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
                res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-apollo-operation-name, apollo-query-plan-experimental');
                res.header('Access-Control-Allow-Credentials', 'true');
                return res.sendStatus(204);
            } else {
                console.warn(`[CORS DEBUG] Rejecting origin: ${origin}`);
                return res.status(403).json({ message: 'CORS Origin Not Allowed' });
            }
        }

        // Apply CORS for regular requests
        cors({
            origin: function (o, callback) {
                if (!o || allowedOrigins.includes(o)) {
                    callback(null, true);
                } else {
                    callback(null, false);
                }
            },
            credentials: true
        })(req, res, next);
    });

    // Global Body Parser
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    // Global Logger
    app.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
            console.log(`[PREFLIGHT] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
            console.log('Headers:', JSON.stringify(req.headers, null, 2));
        } else {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        }
        next();
    });

    // Auth Middleware for all routes
    app.use(authMiddleware);

    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({ req }: any) => {
                return { user: req.user }; // Use user from middleware
            },
        }) as unknown as express.RequestHandler,
    );

    // REST API Routes
    app.use('/api/blogs', blogRoutes);
    app.use('/api/blog-categories', blogCategoryRoutes);
    app.use('/api/upload', uploadRoutes);
    app.use('/api/team', teamRoutes);
    app.use('/api/ai-courses', aiCourseRoutes);

    // Global Error Handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error('Unhandled Server Error:', err);
        res.status(500).json({
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    });

    const PORT = process.env.PORT || 4000;

    httpServer.listen(Number(PORT), () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
};

startServer().catch(err => {
    console.error('CRITICAL: Server failed to start:', err);
});
