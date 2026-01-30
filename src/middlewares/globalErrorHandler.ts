/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { QueryFailedError } from 'typeorm';
import AppError from '../helpers/AppError';

const globalErrorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Something went wrong';
    let details: unknown = undefined;

    // ========= TypeORM Errors =========
    if (err instanceof QueryFailedError) {
        statusCode = StatusCodes.BAD_REQUEST;
        message = 'Database query failed';
        details = err.message;
    }

    // ========= JWT Errors =========
    else if (err instanceof JsonWebTokenError) {
        statusCode = StatusCodes.UNAUTHORIZED;
        message = 'Invalid authentication token';
    } else if (err instanceof TokenExpiredError) {
        statusCode = StatusCodes.UNAUTHORIZED;
        message = 'Authentication token expired';
    }

    // ========= Custom AppError =========
    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        details = err.details;
    }

    // ========= Validation Errors =========
    else if (err?.name === 'ZodError') {
        statusCode = StatusCodes.BAD_REQUEST;
        message = 'Validation failed';
        details = err.errors;
    }

    // ========= Axios / External =========
    else if (err?.isAxiosError) {
        statusCode = err.response?.status || StatusCodes.BAD_GATEWAY;
        message =
            err.response?.data?.message || 'External service request failed';
        details = err.response?.data;
    }

    // ========= Fallback =========
    else if (statusCode >= 500) {
        message = message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            details,
            stack: err.stack,
        }),
    });
};

export default globalErrorHandler;
