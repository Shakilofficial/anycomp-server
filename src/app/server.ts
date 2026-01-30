import type { Server } from 'http';
import config from '../config';
import { AppDataSource } from '../config/database';
import app from './app';

let server: Server;

const shutdown = async () => {
    console.log('🛑 Graceful shutdown initiated');

    if (server) {
        server.close(() => {
            console.log('✅ HTTP server closed');
            process.exit(0);
        });
    }
};

async function main(): Promise<void> {
    try {
        await AppDataSource.initialize();
        console.log('📦 Database connected');

        server = app.listen(config.PORT, () => {
            console.log(`🚀 Server running on port ${config.PORT}`);
        });

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    } catch (error) {
        console.error('💥 Startup error:', error);
        process.exit(1);
    }
}

process.on('uncaughtException', err => {
    console.error('❌ Uncaught Exception:', err);
    shutdown();
});

process.on('unhandledRejection', reason => {
    console.error('⚠️ Unhandled Rejection:', reason);
    shutdown();
});

main();
