import { HttpInterceptorFn } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const keycloakService = inject(KeycloakService);

    // Lista de URLs públicas que não requerem autenticação
    const publicUrls = ['/api/public/'];

    // Verifica se a URL é pública
    const isPublic = publicUrls.some((url) => req.url.includes(url));

    if (isPublic) {
        // Se for uma URL pública, segue sem adicionar o cabeçalho Authorization
        return next(req);
    }


    return from(keycloakService.getToken()).pipe(
        switchMap((token) => {
            const clonedRequest = req.clone({
                setHeaders: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });
            return next(clonedRequest);
        })
    );
};
