import { DataSource } from 'typeorm';
import config from '.';

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: config.DATABASE_URL,
    ssl:
        config.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,

    entities: [
        config.NODE_ENV === 'production'
            ? 'dist/modules/**/*.entity.js'
            : 'src/modules/**/*.entity.ts',
    ],

    migrations: [
        config.NODE_ENV === 'production'
            ? 'dist/migrations/*.js'
            : 'src/migrations/*.ts',
    ],

    synchronize: false,
    logging: config.NODE_ENV !== 'production',
});
