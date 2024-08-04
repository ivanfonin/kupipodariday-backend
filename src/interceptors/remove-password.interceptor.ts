import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((obj) => {
            if (obj.hasOwnProperty('owner')) {
              if (obj.owner.hasOwnProperty('password')) {
                delete obj.owner.password;
              }
            }
            if (obj.hasOwnProperty('password')) {
              delete obj.password;
            }
            return obj;
          });
        } else {
          if (data.hasOwnProperty('owner')) {
            if (data.owner.hasOwnProperty('password')) {
              delete data.owner.password;
            }
          }
          if (data.hasOwnProperty('password')) {
            delete data.password;
          }
          return data;
        }
      }),
    );
  }
}
