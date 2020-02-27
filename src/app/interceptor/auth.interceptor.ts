import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${environment.apiUrl}`,
        'Content-Type': 'application/json'
    });
    request = request.clone({ headers });
    return next.handle(request);
  }
}