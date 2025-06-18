import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';

import { authInterceptor } from './security/auth.interceptor';

import { provideToastr } from 'ngx-toastr';
import { initializeKeycloak } from './keycloak/keycloak-init.factory';
import { MessageService } from './shared/service/message.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';


export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()), // Adicionando withFetch
    provideRouter(routes, withViewTransitions()),
    provideToastr(),

    KeycloakService,
    provideAppInitializer(() => {
      const keycloakService = inject(KeycloakService);
      return initializeKeycloak(keycloakService)(); // Chama a função que agora retorna um Observable
    }),
    MessageService, provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
};
