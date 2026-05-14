import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Instrument } from '../models/instrument.model';

@Injectable({ providedIn: 'root' })
export class InstrumentService {
  private base = `${environment.apiUrl}/instruments`;

  constructor(private http: HttpClient) {}

  getAll(category?: string, q?: string): Observable<{ instruments: Instrument[] }> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (q) params = params.set('q', q);
    return this.http.get<{ instruments: Instrument[] }>(this.base, { params });
  }

  getOne(id: string): Observable<Instrument> {
    return this.http.get<Instrument>(`${this.base}/${id}`);
  }

  create(dto: Partial<Instrument>): Observable<{ instrument: Instrument }> {
    return this.http.post<{ instrument: Instrument }>(this.base, dto);
  }
}
