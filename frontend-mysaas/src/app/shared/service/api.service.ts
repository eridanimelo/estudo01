// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';

// @Injectable({
//     providedIn: 'root',
// })
// export class ApiService {
//     private baseUrl = environment.apiChatUrl;

//     constructor(private http: HttpClient) { }

//     getMessages(lastTimestamp: string | null = null, limit: number = 20): Observable<any[]> {
//         const params: any = {};
//         if (lastTimestamp) params.lastTimestamp = lastTimestamp;
//         params.limit = limit;
//         return this.http.get<any[]>(`${this.baseUrl}/messages`, { params });
//     }

//     createMessage(message: { user: string; content: string }): Observable<any> {
//         return this.http.post(`${this.baseUrl}/messages`, message);
//     }
// }
