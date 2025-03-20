// Import necessary modules and services from Angular and other libraries
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './service/auth-interceptor';

// Export the application configuration
export const appConfig: ApplicationConfig = {
  // Array of providers for the application
  providers: [
    // Provide the router with the defined routes
    provideRouter(routes),
    // Provide the HttpClient with an interceptor and XSRF configuration
    provideHttpClient(
      // Add the authInterceptor to handle authentication-related tasks
      withInterceptors([authInterceptor]),
      // Configure XSRF protection using a cookie and header
      withXsrfConfiguration({
        // Name of the cookie containing the XSRF token
        cookieName: 'XSRF-TOKEN',
        // Name of the header containing the XSRF token
        headerName: 'X-XSRF-TOKEN',
      })
    ),
    // Provide animations for the application
    provideAnimations(),
  ],
};
