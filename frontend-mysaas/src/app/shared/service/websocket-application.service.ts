import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class WebsocketApplicationService {
    private socket!: Socket;
    private connected = false; // Flag para evitar reconexões desnecessárias

    constructor(private keycloakService: KeycloakService) { }

    async connect() {
        if (this.connected) {
            console.warn('⚠️ WebSocket já está conectado.');
            return;
        }

        const isLoggedIn = await this.keycloakService.isLoggedIn();
        if (!isLoggedIn) {
            console.warn('🔒 Usuário não autenticado. WebSocket não será inicializado.');
            return;
        }

        // ✅ Obtém o token do Keycloak
        const token = await this.keycloakService.getToken();

        this.socket = io(environment.socketUrlSpringBoot, {
            transports: ['websocket'], // ⚠️ Evita polling, apenas WebSocket
            withCredentials: true,
            extraHeaders: {
                Authorization: `Bearer ${token}`, // Passa o token JWT do Keycloak
            },
        });

        this.connected = true;

        this.socket.on('connect', () => {
            console.log('✅ Conectado ao WebSocket!');
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Desconectado do WebSocket.');
            this.connected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('⚠️ Erro ao conectar WebSocket:', error);
        });
    }

    listenForNotifications(userId: string, callback: (message: any) => void) {
        if (!this.socket) {
            console.warn('⚠️ WebSocket não está conectado.');
            return;
        }
        this.socket.on(`notification_${userId}`, (message) => {
            callback(message);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.connected = false;
            console.log('🔌 WebSocket desconectado.');
        }
    }
}
