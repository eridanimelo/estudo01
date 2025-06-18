import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
    provideKeycloak,
    createInterceptorCondition,
    IncludeBearerTokenCondition,
    withAutoRefreshToken,
    AutoRefreshTokenService,
    UserActivityService,
    INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
} from 'keycloak-angular';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
    constructor(@Inject(PLATFORM_ID) private platformId: object) { }

    getKeycloakProvider() {
        if (isPlatformBrowser(this.platformId)) {
            const localhostCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
                urlPattern: /^(http:\/\/localhost:(8080|8082))(\/.*)?$/i,
            });

            return provideKeycloak({
                config: {
                    realm: 'user-api',
                    url: environment.apiKeycloak,
                    clientId: 'userapi',
                },
                initOptions: {
                    onLoad: 'check-sso',
                    checkLoginIframe: false,
                },
                features: [
                    withAutoRefreshToken({
                        onInactivityTimeout: 'logout',
                        sessionTimeout: 60000, // 60 segundos para inatividade
                    }),
                ],
                providers: [
                    AutoRefreshTokenService,
                    UserActivityService,
                    {
                        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
                        useValue: [localhostCondition],
                    },
                ],
            });
        }

        // No lado do servidor, retorna um array vazio
        return [];
    }
}
