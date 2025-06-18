import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = '/api'; // URL base da API no Spring Boot

  constructor(private http: HttpClient) { }

  confirmPayment(paymentMethodId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirm-payment`, { paymentMethodId });
  }
}
