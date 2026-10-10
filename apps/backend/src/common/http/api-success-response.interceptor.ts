import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

type SuccessResponse = {
    message?: string;
    data: unknown;
    meta?: unknown;
};

@Injectable()
export class ApiSuccessResponseInterceptor implements NestInterceptor<SuccessResponse, SuccessResponse> {
    intercept(_context: ExecutionContext, next: CallHandler<SuccessResponse>): Observable<SuccessResponse> {
        return next.handle().pipe(
            map((response) => ({
                ...response,
                message: response.message ?? '정상 처리되었습니다.',
            })),
        );
    }
}
