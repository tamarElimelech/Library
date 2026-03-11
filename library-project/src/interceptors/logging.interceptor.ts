import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const request = context.switchToHttp().getRequest()
        const className = context.getClass().name
        const handlerName = context.getHandler().name
        const body = request.body

        const logger = new Logger(className)

        logger.log(`ENTER ${handlerName} | Body: ${JSON.stringify(body)}`);

        return next.handle().pipe(
            tap(response => {
                logger.log(`EXIT ${handlerName} | Response: ${JSON.stringify(response)} `)
            }),
            catchError(err => {
                logger.error(`ERROR ${handlerName} | Message: ${err.message}`, err.stack)
                throw err
            })
        );
    }
}