import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface UserRepresentation {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  enabled?: boolean;
  attributes?: { [key: string]: any };
}

export interface RoleRepresentation {
  id?: string;
  name: string;
  description?: string;
  composite?: boolean;
  clientRole?: boolean;
  containerId?: string;
}

export interface UserRequestDTO {
  user: UserRepresentation;
  password: string;
  tenentId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/user-sercurity`;

  constructor(private http: HttpClient) { }

  createUser(userRequest: UserRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, userRequest);
  }

  resetPassword(userRequest: UserRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, userRequest);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete?userId=${userId}`);
  }

  disableUser(userId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/disable?userId=${userId}`, {});
  }

  enableUser(userId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/enable?userId=${userId}`, {});
  }

  listAllUsers(): Observable<UserRepresentation[]> {
    return this.http.get<UserRepresentation[]>(`${this.apiUrl}/list`);
  }

  listAllRoles(): Observable<RoleRepresentation[]> {
    return this.http.get<RoleRepresentation[]>(`${this.apiUrl}/roles`);
  }

  assignRole(userId: string, roleName: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/roles/add?roleName=${roleName}`, {});
  }

  removeRole(userId: string, roleName: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/roles/remove?roleName=${roleName}`, {});
  }

  enableTOTP(userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/enable-totp`, {});
  }

  disableTOTP(userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/disable-totp`, {});
  }

  toggleLoggedInUserTOTP(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/totp/toggle`, {});
  }


  abc(): Observable<any> {
    return this.http.get<string>('http://localhost:8082/api/checkout/1');
  }



}
