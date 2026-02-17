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
    initKronos();

    const app = express();
    const httpServer = http.createServer(app);

    await connectDB();

    // =============================
    // ✅ PRODUCTION SAFE CORS
    // =============================

    const allowedOrigins = (
        process.env.ALLOWED_ORIGINS ||
        'http://localhost:8080,http://localhost:5173,https://www.codemande.com,https://codemande.com,https://*.codemande.com'
    )
        .split(',')
        .map(o => o.trim())
        .filter(Boolean);

    const isAllowedOrigin = (origin: string) => {
        return allowedOrigins.some((allowed) => {
            if (allowed === '*') return true;

            if (allowed.includes('*')) {
                const escaped = allowed
                    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
                    .replace(/\*/g, '.*');
                return new RegExp(`^${escaped}$`).test(origin);
            }

            return allowed === origin;
        });
    };

    const corsOptions: cors.CorsOptions = {
        origin: (origin, callback) => {
            if (!origin) return callback(null, true); // allow server-to-server

            if (isAllowedOrigin(origin)) {
                return callback(null, origin);
            }

            console.warn('❌ Blocked by CORS:', origin);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'x-apollo-operation-name',
            'apollo-query-plan-experimental'
        ]
    };

    app.use(cors(corsOptions));

    // VERY IMPORTANT → enable preflight globally
    app.options('*', cors(corsOptions));

    // =============================

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    // =============================
    // AUTH MIDDLEWARE
    // =============================

    app.use(authMiddleware);

    // =============================
    // GRAPHQL SCHEMA
    // =============================

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    // =============================
    // WEBSOCKET SERVER
    // =============================

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
                    user = jwt.verify(
                        token.replace('Bearer ', ''),
                        process.env.JWT_SECRET || 'secret'
                    );
                } catch (e) {
                    console.warn('Invalid WS Token');
                }
            }

            return { user };
        }
    }, wsServer);

    // =============================
    // APOLLO SERVER
    // =============================

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

    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({ req }: any) => ({
                user: req.user
            }),
        }) as unknown as express.RequestHandler
    );

    // =============================
    // REST ROUTES
    // =============================

    app.use('/api/blogs', blogRoutes);
    app.use('/api/blog-categories', blogCategoryRoutes);
    app.use('/api/upload', uploadRoutes);
    app.use('/api/team', teamRoutes);
    // app.use('/api/ai-courses', aiCourseRoutes); // Disabled for deployment

    // =============================
    // GLOBAL ERROR HANDLER
    // =============================

    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error('🔥 Server Error:', err);
        res.status(500).json({
            message: err.message || 'Internal Server Error'
        });
    });

    const PORT = process.env.PORT || 4000;

    httpServer.listen(Number(PORT), () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
};

startServer().catch(err => {
    console.error('CRITICAL STARTUP ERROR:', err);
});
