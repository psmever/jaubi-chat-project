import type { ApiErrorResponse } from '@jaubi-chat/api-contract';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { ApiException } from './api-exception.ts';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ApiExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>();

        if (exception instanceof ApiException) {
            response.status(exception.getStatus()).json({
                error: {
                    code: exception.code,
                    message: exception.message,
                    details: exception.details,
                },
            });

            return;
        }

        if (exception instanceof HttpException) {
            const status = exception.getStatus();

            response.status(status).json({
                error: {
                    code: this.getHttpErrorCode(status),
                    message: exception.message,
                    details: null,
                },
            });

            return;
        }

        this.logUnknownException(exception);

        const body: ApiErrorResponse = {
            error: {
                code: 'COMMON_INTERNAL_ERROR',
                message: '서버 오류가 발생했습니다.',
                details: null,
            },
        };

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
    }

    private getHttpErrorCode(status: number): string {
        switch (status) {
            case HttpStatus.BAD_REQUEST:
                return 'COMMON_BAD_REQUEST';
            case HttpStatus.UNAUTHORIZED:
                return 'COMMON_UNAUTHORIZED';
            case HttpStatus.FORBIDDEN:
                return 'COMMON_FORBIDDEN';
            case HttpStatus.NOT_FOUND:
                return 'COMMON_NOT_FOUND';
            case HttpStatus.CONFLICT:
                return 'COMMON_CONFLICT';
            default:
                return 'COMMON_HTTP_ERROR';
        }
    }

    private logUnknownException(exception: unknown): void {
        if (exception instanceof Error) {
            this.logger.error(exception.message, exception.stack);
            return;
        }

        this.logger.error('알 수 없는 서버 오류가 발생했습니다.');
    }
}
