import {
    provideKeycloak,
    createInterceptorCondition,
    IncludeBearerTokenCondition,
    withAutoRefreshToken,
    AutoRefreshTokenService,
    UserActivityService,
    INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
} from 'keycloak-angular';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';

export function provideKeycloakAngular(platformId: Object) {
    if (isPlatformBrowser(platformId)) {
        const localhostCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
            urlPattern: /^(http:\/\/localhost:(8080|8082))(\/.*)?$/i,
        });
        const excludedUrlsCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
            urlPattern: /^(\/assets|\/public)/, // Excluir URLs começando com "/assets" ou "/public"
            httpMethods: ['GET', 'POST'], // Aplicável apenas a requisições GET (opcional)
        })

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
                    sessionTimeout: 60000,
                }),
            ],
            providers: [
                AutoRefreshTokenService,
                UserActivityService,
                {
                    provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
                    useValue: [localhostCondition, excludedUrlsCondition],

                },
            ],
        });
    }

    // Retorna um array vazio no lado do servidor
    return [];
}
