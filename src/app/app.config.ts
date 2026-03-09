import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core'; // app config type
import { provideRouter } from '@angular/router'; // router provider
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // http provider
import { routes } from './app.routes'; // routes
import { authInterceptor } from './core/auth/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes), // enable routing
    provideHttpClient(withInterceptors([authInterceptor])), // enable HttpClient
  ],
};
