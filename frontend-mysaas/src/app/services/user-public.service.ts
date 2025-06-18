import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRequestDTO } from './user.service';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root',
})
export class UserPublicService {

  private apiUrl = `${environment.apiUrl}/public/users`;

  constructor(private http: HttpClient) { }

  createUser(userRequest: UserRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, userRequest);
  }

}
