import { KeycloakService } from 'keycloak-angular';
import { from, Observable } from 'rxjs'; // Importando o operador from para converter Promise em Observable
import { environment } from '../../environments/environment';


export function initializeKeycloak(keycloak: KeycloakService) {
    return (): Observable<any> => {
        if (typeof window !== 'undefined') {

            return from(
                keycloak.init({
                    config: {
                        url: environment.apiKeycloak,
                        realm: 'user-api',
                        clientId: 'userapi',
                    },
                    initOptions: {
                        onLoad: 'check-sso',
                        checkLoginIframe: false,
                    },
                    enableBearerInterceptor: true,
                    bearerExcludedUrls: ['/assets', '/public'],
                })
            );
        } else {
            // Se estiver no lado do servidor, retorna um Observable resolvido imediatamente
            return from(Promise.resolve());
        }
    };
}
