import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    private socket: Socket | undefined;

    constructor(private http: HttpClient, private keycloakService: KeycloakService) {
        this.initializeSocket();
    }

    private async initializeSocket(): Promise<void> {
        try {
            // Verifica se o usuário está autenticado
            const isAuthenticated = await this.keycloakService.isLoggedIn();
            if (!isAuthenticated) {
                console.warn('Usuário não autenticado. WebSocket não será inicializado.');

                return;
            }

            // Obtém o token do Keycloak
            const token = await this.keycloakService?.getToken();

            if (!token) return;

            // Conecta ao WebSocket e adiciona o token no handshake
            this.socket = io(environment.socketUrl, {
                auth: {
                    token: token ? `Bearer ${token}` : '',
                },
            });

            // Configura eventos básicos do WebSocket
            this.socket.on('connect', () => {
                console.log('Conectado ao WebSocket com autenticação');
            });

            this.socket.on('connect_error', (error: any) => {
                console.error('Erro na conexão WebSocket:', error);
            });

            this.socket.on('disconnect', async (reason: string) => {
                console.warn('WebSocket desconectado:', reason);
                if (reason === 'io server disconnect') {
                    // Reautoriza automaticamente se o servidor desconectar
                    await this.reauthorizeSocket();
                }
            });
        } catch (error) {
            console.error('Erro ao inicializar o WebSocket:', error);
        }
    }

    private async reauthorizeSocket(): Promise<void> {
        try {
            const token = await this.keycloakService.getToken();
            if (this.socket) {
                this.socket.auth = { token: token ? `Bearer ${token}` : '' };
                this.socket.connect();
                console.log('WebSocket reautorizado com sucesso.');
            }
        } catch (error) {
            console.error('Erro ao reautorizar o WebSocket:', error);
        }
    }

    // Registrar usuário no servidor WebSocket
    registerUser(userEmail: string) {
        this.socket?.emit('registerUser', userEmail);
    }

    // Emitir mensagem
    sendMessage(message: any) {
        this.socket?.emit('sendMessage', message);
    }

    // Emitir evento de "digitando"
    startTyping(senderId: string, receiverId: string) {
        this.socket?.emit('typing', { senderId, receiverId });
    }

    // Emitir evento de "parou de digitar"
    stopTyping(senderId: string, receiverId: string) {
        this.socket?.emit('stopTyping', { senderId, receiverId });
    }

    // Buscar histórico de mensagens
    getMessageHistory(senderEmail: string, receiverEmail: string, limit: number, skip: number): Observable<any[]> {
        const url = `${environment.apiChatUrl}/messages/${senderEmail}/${receiverEmail}?limit=${limit}&skip=${skip}`;
        return this.http.get<any[]>(url);
    }

    // Receber lista inicial de usuários online
    getOnlineUsers(): Observable<string[]> {
        return new Observable((observer) => {
            this.socket?.on('onlineUsers', (onlineUsers: string[]) => {
                observer.next(onlineUsers);
            });
        });
    }

    // Ouvir evento de login de usuário
    onUserLoggedIn(): Observable<string> {
        return new Observable((observer) => {
            this.socket?.on('userLoggedIn', (userEmail: string) => {
                observer.next(userEmail);
            });
        });
    }

    // Ouvir evento de logout de usuário
    onUserLoggedOut(): Observable<string> {
        return new Observable((observer) => {
            this.socket?.on('userLoggedOut', (userEmail: string) => {
                observer.next(userEmail);
            });
        });
    }

    // Ouvir evento de nova mensagem
    onNewMessage(): Observable<any> {
        return new Observable((observer) => {
            this.socket?.on('newMessage', (data) => {
                observer.next(data);
            });
        });
    }

    // Ouvir atualizações de status de mensagem
    onMessageStatusUpdate(): Observable<any> {
        return new Observable((observer) => {
            this.socket?.on('messageStatusUpdate', (data) => {
                observer.next(data);
            });
        });
    }

    // Ouvir evento de "digitando"
    onUserTyping(): Observable<{ senderId: string }> {
        return new Observable((observer) => {
            this.socket?.on('userTyping', (data: { senderId: string }) => {
                observer.next(data);
            });
        });
    }

    // Ouvir evento de "parou de digitar"
    onUserStoppedTyping(): Observable<{ senderId: string }> {
        return new Observable((observer) => {
            this.socket?.on('userStoppedTyping', (data: { senderId: string }) => {
                observer.next(data);
            });
        });
    }

    selectChat(chatId: string) {
        this.socket?.emit('selectChat', chatId);
    }

    // Marcar mensagens como lidas
    markMessageAsRead(senderEmail: string, receiverEmail: string) {
        this.socket?.emit('messageRead', { senderId: senderEmail, receiverId: receiverEmail });
    }

    getLastMessages(userId: string): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiChatUrl}/last-messages/${userId}`);
    }
}
