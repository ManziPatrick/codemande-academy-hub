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

    // General CORS middleware for all requests
    app.use(cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn(`[CORS Reject] Origin ${origin} is not in allowed list`);
                callback(null, false);
            }
        },
        credentials: true
    }));

    // Preflight handler (must be before authMiddleware and routes)
    app.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
            return cors({
                origin: function (origin, callback) {
                    if (!origin || allowedOrigins.includes(origin)) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                },
                credentials: true,
                methods: ['GET', 'POST', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization'],
            })(req, res, next);
        }
        next();
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
