import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { buildErrorResponse } from '../functions/responses.function';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = this.getMessage(exception);
            exception.message = message;

            return response.status(status).json(buildErrorResponse(false, exception));
        }

        console.log('\x1b[31m%s\x1b[0m', '************* ⚠️  ERRO ⚠️ *************');
        console.error(exception);
        console.log('\x1b[31m%s\x1b[0m', '*************************************');

        return response.status(status).json(message);
    }

    private getMessage(exception: HttpException): string | any {
        const res: { message: string[] } | string | any = exception.getResponse()

        if (typeof res !== 'string' && Array.isArray(res.message)) {
            return res.message.join(' | ');
        }

        return exception.message;
    }
}
