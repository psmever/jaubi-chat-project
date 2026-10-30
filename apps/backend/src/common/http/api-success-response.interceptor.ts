import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

type SuccessResponse = {
    message?: string;
    data: unknown;
    meta?: unknown;
};

const isSuccessResponseInterceptor = (response: unknown): response is SuccessResponse => {
    return typeof response === 'object' && response !== null && !Array.isArray(response) && 'data' in response;
};

@Injectable()
export class ApiSuccessResponseInterceptor implements NestInterceptor<SuccessResponse, SuccessResponse> {
    intercept(_context: ExecutionContext, next: CallHandler<SuccessResponse>): Observable<SuccessResponse> {
        return next.handle().pipe(
            map((response) => {
                if (isSuccessResponseInterceptor(response)) {
                    return {
                        ...response,
                        message: response.message ?? '정상 처리되었습니다.',
                    };
                }
                return response;
            }),
        );
    }
}
