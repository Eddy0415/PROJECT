import { ApplicationConfig } from '@angular/core';      // app config type
import { provideRouter } from '@angular/router';       // router provider
import { provideHttpClient } from '@angular/common/http'; // http provider
import { routes } from './app.routes';                 // routes

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),                              // enable routing
    provideHttpClient(),                                // enable HttpClient
  ],
};