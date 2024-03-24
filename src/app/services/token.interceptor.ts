import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';

@Injectable()
export class tokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenizedReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YourAccessToken', // Add any other headers you need
        'ngrok-skip-browser-warning': 'your-custom-value'
      }
    })
    return next.handle(tokenizedReq).pipe(
      retry(2)
    );
  }
}
