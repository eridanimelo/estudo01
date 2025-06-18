import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private apiUrl = 'http://localhost:8082/api/avatar';

  // BehaviorSubject para armazenar o avatar atualizado
  private avatarSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) { }

  // Retorna o avatar como Observable
  get avatar$(): Observable<string | null> {
    return this.avatarSubject.asObservable();
  }

  // Atualiza o BehaviorSubject
  updateAvatar(avatar: string): void {
    this.avatarSubject.next(avatar);
  }

  // Carrega o avatar do usuário logado
  loadLoggedUserAvatar(): void {
    this.http.get<any>(`${this.apiUrl}/logged-user`).subscribe({
      next: (avatar) => {
        const base64Image = `data:${avatar.tipo};base64,${avatar.upload}`;
        this.updateAvatar(base64Image);
      },
      error: (err) => console.error('Failed to load user avatar', err),
    });
  }

  getAvatarsList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/logged-user-list`);
  }


  // Faz o upload do avatar
  uploadAvatar(file: File, userId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
