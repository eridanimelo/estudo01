import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableDto } from '../shared/lazy/pageable-dto';
import { Page } from '../shared/lazy/page';
import { environment } from '../../environments/environment';

export interface FAQ {
  id?: number;
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class FAQService {

  private baseUrl = `${environment.apiUrl}/faqs`;

  constructor(private http: HttpClient) { }

  getAllFAQs(): Observable<FAQ[]> {
    return this.http.get<FAQ[]>(this.baseUrl);
  }

  getAllFAQsLazy(pageableDto: PageableDto<FAQ>): Observable<Page<FAQ>> {
    return this.http.post<Page<FAQ>>(`${this.baseUrl}/lazy`, pageableDto);
  }

  createFAQ(faq: FAQ): Observable<FAQ> {
    return this.http.post<FAQ>(this.baseUrl, faq);
  }

  updateFAQ(faq: FAQ): Observable<FAQ> {
    return this.http.put<FAQ>(`${this.baseUrl}/${faq.id}`, faq);
  }

  deleteFAQ(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
