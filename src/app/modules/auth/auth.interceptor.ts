import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('/login')) {
            return next.handle(req);
        }
        const token = sessionStorage.getItem('auth_token');
        if (!token) {
            return next.handle(req);
        }
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        // Pass the cloned request instead of the original request to the next handler
        return next.handle(authReq);
    }
}