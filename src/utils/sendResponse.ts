import { Response } from 'express';
import { IResponse, TErrorResponse } from '../interfaces/response';

export const sendError = (res: Response, data: TErrorResponse) => {
    const response: Partial<TErrorResponse> & {
        success: false;
        stack: string | null;
    } = {
        success: false,
        message: data.message,
        errorMessages: data.errorMessages,
        stack: data?.stack || null,
    };

    res.status(data.status).json(response);
};

export const sendResponse = <T>(res: Response, data: IResponse<T>) => {
    const response: Partial<IResponse<T>> = {
        status: data.status,
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data || null || undefined,
    };

    res.status(data.status).json(response);
};
