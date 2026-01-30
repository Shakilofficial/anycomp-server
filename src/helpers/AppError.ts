import { StatusCodes } from 'http-status-codes';

export default class AppError extends Error {
    statusCode: number;
    details?: unknown;

    constructor(
        statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
        message = 'Something went wrong',
        details?: unknown,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
