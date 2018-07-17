import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

// tslint:disable-next-line:one-line
export class ApiInterceptor implements HttpInterceptor {
  // tslint:disable-next-line:max-line-length
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    const started = Date.now();
    let authReq;
    if (localStorage.getItem('token')) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', localStorage.getItem('token')).append('userID', localStorage.getItem('userID'))
      });
    } else {
      authReq = req.clone();
    }

    return next
      .handle(authReq)
      .do(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
        }
      });
  }
}
