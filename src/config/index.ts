import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

type NodeEnv = 'development' | 'production' | 'test';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join(process.cwd(), '.env') });
}

interface EnvConfig {
    PORT: string;
    DATABASE_URL: string;
    NODE_ENV: NodeEnv;
    EXPRESS_SESSION_SECRET: string;
    BCRYPT_SALT_ROUND: string;
    FRONTEND_URL: string;
    JWT: {
        JWT_ACCESS_SECRET: string;
        JWT_ACCESS_EXPIRES: string;
        JWT_REFRESH_SECRET: string;
        JWT_REFRESH_EXPIRES: string;
        JWT_RESET_PASS_SECRET: string;
        JWT_RESET_PASS_SECRET_EXPIRES: string;
    };
    SUPER_ADMIN: {
        SUPER_ADMIN_EMAIL: string;
        SUPER_ADMIN_PASSWORD: string;
    };
}

const requiredEnvVariables: (keyof EnvConfig | string)[] = [
    'PORT',
    'DATABASE_URL',
    'NODE_ENV',
    'BCRYPT_SALT_ROUND',
    'FRONTEND_URL',
    'JWT_ACCESS_SECRET',
    'JWT_ACCESS_EXPIRES',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRES',
    'JWT_RESET_PASS_SECRET',
    'JWT_RESET_PASS_SECRET_EXPIRES',
    'EXPRESS_SESSION_SECRET',
    'SUPER_ADMIN_EMAIL',
    'SUPER_ADMIN_PASSWORD',
];

requiredEnvVariables.forEach(key => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

const config: EnvConfig = {
    PORT: process.env.PORT!,
    DATABASE_URL: process.env.DATABASE_URL!,
    NODE_ENV: process.env.NODE_ENV as NodeEnv,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND!,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    JWT: {
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES!,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES!,
        JWT_RESET_PASS_SECRET: process.env.JWT_RESET_PASS_SECRET!,
        JWT_RESET_PASS_SECRET_EXPIRES:
            process.env.JWT_RESET_PASS_SECRET_EXPIRES!,
    },
    SUPER_ADMIN: {
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL!,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD!,
    },
};

export default config;
