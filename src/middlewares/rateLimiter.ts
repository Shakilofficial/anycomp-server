import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../helpers/AppError';

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

const MAX_REQUESTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export const rateLimiter = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const ip = req.ip || 'unknown';
    const identifier = req.body?.email || req.query?.email || ip;

    const key = `${ip}:${identifier}`;
    const now = Date.now();

    const record = store.get(key);

    if (!record || now > record.resetTime) {
        store.set(key, {
            count: 1,
            resetTime: now + WINDOW_MS,
        });
        return next();
    }

    if (record.count < MAX_REQUESTS) {
        record.count++;
        return next();
    }

    throw new AppError(
        StatusCodes.TOO_MANY_REQUESTS,
        `Too many requests. Try again after ${new Date(
            record.resetTime,
        ).toLocaleTimeString()}`,
    );
};

// Periodic cleanup
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
        if (now > value.resetTime) {
            store.delete(key);
        }
    }
}, WINDOW_MS);
