import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiFieldError } from '@jaubi-chat/api-contract';

export class ApiException extends HttpException {
  constructor(
    public readonly code: string,
    message: string,
    status: HttpStatus,
    public readonly details: ApiFieldError[] | null = null,
  ) {
    super(message, status);
  }
}
