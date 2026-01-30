export interface IMeta {
    page: number;
    limit: number;
    total: number;
}

export interface IResponse<T> {
    status: number;
    success: boolean;
    message: string;
    meta?: IMeta;
    data: T | null | undefined;
}

export type TErrorMessages = {
    path: string | number;
    message: string;
}[];

export type TErrorResponse = {
    status: number;
    message: string;
    errorMessages: TErrorMessages;
    stack?: string | null;
};
