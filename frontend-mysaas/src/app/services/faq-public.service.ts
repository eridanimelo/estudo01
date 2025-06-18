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
export class FAQSPublicervice {

  private baseUrl = `${environment.apiUrl}//public/faq`;

  constructor(private http: HttpClient) { }

  getAllFAQs(): Observable<FAQ[]> {
    return this.http.get<FAQ[]>(this.baseUrl);
  }

}
