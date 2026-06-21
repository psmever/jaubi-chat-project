export type ApiSuccessResponse<T, TMeta = never> = {
    data: T;
    meta?: TMeta;
};

export type ApiFieldError = {
    field: string;
    message: string;
};

export type ApiErrorResponse = {
    error: {
        code: string;
        message: string;
        details?: ApiFieldError[] | null;
    };
};

export type CursorMeta = {
    nextCursor: string | null;
    hasNext: boolean;
};
