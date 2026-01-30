import { StatusCodes } from 'http-status-codes';
import AppError from '../helpers/AppError';
import catchAsync from '../utils/catchAsync';

export const parseBody = catchAsync(async (req, _res, next) => {
    /**
     * Expected multipart/form-data:
     * - file (optional)
     * - data (JSON string)
     */

    if (req.body?.data) {
        try {
            req.body = JSON.parse(req.body.data);
            return next();
        } catch {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                'Invalid JSON format in "data" field',
            );
        }
    }

    if (req.file) {
        req.body = {};
        return next();
    }

    throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Request must include "data" field as JSON string or a file',
    );
});
