import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

/**
 * Interceptor for handling API errors globally
 */
@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      // Retry once in case of network issues
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        
        // Client-side errors
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Client-side error: ${error.error.message}`;
        } 
        // Server-side errors
        else {
          // Handle different HTTP status codes appropriately
          switch (error.status) {
            case 401: // Unauthorized
              errorMessage = 'You are not authorized to access this resource. Please log in again.';
              this.router.navigate(['/auth/login']);
              break;
            
            case 403: // Forbidden
              errorMessage = 'You do not have permission to access this resource.';
              this.router.navigate(['/unauthorized']);
              break;
            
            case 404: // Not Found
              errorMessage = 'Resource not found.';
              break;
              
            case 500: // Server Error
              errorMessage = 'Server error occurred. Please try again later.';
              break;
              
            default:
              errorMessage = `Server error: ${error.message}`;
              break;
          }
        }
        
        // Show notification to user
        this.notificationService.sendNotification({
          title: 'Error',
          message: errorMessage,
          type: 'error',
          category: 'system'
        });
        
        // Log the error for debugging
        console.error('API Error:', error);
        
        // Forward the error
        return throwError(() => error);
      })
    );
  }
}
