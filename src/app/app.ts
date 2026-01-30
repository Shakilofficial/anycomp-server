import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Application, Request, Response } from 'express';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import StatusCodes from 'http-status-codes';
import os from 'os';
import config from '../config';
import globalErrorHandler from '../middlewares/globalErrorHandler';
import notFound from '../middlewares/notFound';

const app: Application = express();

// 🔹 Trust reverse proxy (NGINX / Cloudflare / Railway)
app.set('trust proxy', 1);

// 🔹 Security headers
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
);

// 🔹 Core middleware
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 🔹 CORS (strict & production-safe)
const allowedOrigins = [config.FRONTEND_URL];

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('CORS policy violation'));
            }
        },
        credentials: true,
    }),
);

// 🔹 Session
app.use(
    session({
        name: 'sid',
        secret: config.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        proxy: true,
        cookie: {
            secure: config.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    }),
);

// 🔹 Health check
app.get('/', (req: Request, res: Response) => {
    const uptime = os.uptime();

    res.status(StatusCodes.OK).json({
        success: true,
        message: '🚀 Anycomp Server is healthy and running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        client: {
            ip:
                (req.headers['x-forwarded-for'] as string)
                    ?.split(',')[0]
                    ?.trim() ||
                req.socket.remoteAddress ||
                'Unknown',
            userAgent: req.headers['user-agent'] ?? 'Unknown',
        },
        server: {
            hostname: os.hostname(),
            platform: os.platform(),
            uptime: `${Math.floor(uptime / 3600)}h ${Math.floor(
                (uptime % 3600) / 60,
            )}m ${Math.floor(uptime % 60)}s`,
        },
    });
});

// 🔹 API routes
// app.use('/api/v1', router);

// 🔹 Error handlers
app.use(notFound);
app.use(globalErrorHandler);

export default app;
