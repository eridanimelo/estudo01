import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js'; // Para acessar o perfil do Keycloak

@Injectable({
    providedIn: 'root', // Para standalone
})
export class AuthGuard {
    constructor(private keycloakService: KeycloakService, private router: Router) { }

    canActivate: CanActivateFn = async (route, state): Promise<boolean> => {
        // Verifica se a rota é pública
        const isPublicRoute = route.data?.['public'] ?? false;
        if (isPublicRoute) {
            return true; // Permite o acesso às rotas públicas
        }

        // Verifica se estamos no cliente (navegador)
        if (typeof window === 'undefined') {
            console.warn('Guard chamado no servidor. Bloqueando acesso.');
            return false; // Bloqueia rotas privadas no SSR
        }

        try {
            // Verifica se o usuário está logado
            const isLoggedIn = await this.keycloakService.isLoggedIn();
            if (!isLoggedIn) {
                await this.keycloakService.login({
                    redirectUri: window.location.origin + state.url,
                });
                return false; // Bloqueia até que o login seja feito
            }

            // Verifica roles, se especificadas
            const requiredRoles = route.data?.['roles'] ?? [];
            if (requiredRoles.length > 0 && !(await this.hasRequiredRoles(requiredRoles))) {
                this.router.navigate(['/unauthorized']);
                return false;
            }

            return true; // Permite acesso se estiver logado e com as roles necessárias
        } catch (error) {
            console.error('Erro no AuthGuard:', error);
            this.router.navigate(['/error']);
            return false; // Redireciona em caso de erro
        }
    };

    // Verifica se o usuário possui as roles exigidas
    private async hasRequiredRoles(requiredRoles: string[]): Promise<boolean> {
        if (!requiredRoles || requiredRoles.length === 0) {
            return true; // Sem roles exigidas, permite o acesso
        }

        try {
            const userRoles = await this.keycloakService.getUserRoles();
            return requiredRoles.every(role => userRoles.includes(role)); // Verifica todas as roles necessárias
        } catch (error) {
            console.error('Erro ao obter roles do usuário:', error);
            return false; // Bloqueia caso não seja possível verificar as roles
        }
    }
}
