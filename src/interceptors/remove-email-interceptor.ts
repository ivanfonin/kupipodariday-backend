import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class RemoveEmailInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((obj) => {
            if (obj.hasOwnProperty('email')) {
              delete obj.email;
            }
            return obj;
          });
        } else {
          if (data.hasOwnProperty('email')) {
            delete data.email;
          }
          return data;
        }
      }),
    );
  }
}
