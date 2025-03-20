// Import necessary modules and services
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';

// Define an HTTP interceptor function for authentication-related tasks
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject the AuthService using Angular's inject function
  const authService = inject(AuthService);

  // Return the next HTTP request with additional error handling
  return next(req).pipe(
    // Use the tap operator to handle errors without affecting the stream
    tap({
      // Handle HTTP errors
      error: (err: HttpErrorResponse) => {
        // Check if the error is a 401 Unauthorized and related to fetching the authenticated user
        if (
          err.status === 401 &&
          err.url &&
          err.url.includes('api/get-authenticated-user') &&
          authService.isAuthenticated()
        ) {
          // Attempt to re-login if the user is authenticated but encounters a 401 error
          authService.login();
        }
        // Check if the error occurs on a non-GET request outside of the songs API or if the user is not authenticated
        else if (
          err.url &&
          ((req.method !== 'GET' && !err.url.endsWith('/api/songs')) ||
            (err.url &&
              !err.url.endsWith('api/get-authenticated-user') &&
              !authService.isAuthenticated()))
        ) {
          // Open the authentication popup if the conditions are met
          authService.openOrCloseAuthPopup('OPEN');
        }
      },
    })
  );
};
