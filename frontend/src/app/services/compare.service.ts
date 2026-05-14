import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CompareResponse } from '../models/instrument.model';

@Injectable({ providedIn: 'root' })
export class CompareService {
  private base = `${environment.apiUrl}/compare`;

  constructor(private http: HttpClient) {}

  compare(instrumentAId: string, instrumentBId: string, context?: string): Observable<CompareResponse> {
    return this.http.post<CompareResponse>(this.base, { instrumentAId, instrumentBId, context });
  }
}
