import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lote {
  id: number;
  batchCode: string;
  quantity: number;
  expiration: boolean;
  quantityIsZero: boolean;
  createdAt: string;
  expirationAt: string;
  productName: string;
  productId: number;
}

export interface LoteRequest {
  batchCode: string;
  quantity: number;
  productId: number;
  expirationAt: string;
}

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/batch';

  listar(): Observable<Lote[]> {
    return this.http.get<Lote[]>(this.apiUrl);
  }

  criar(lote: LoteRequest): Observable<Lote> {
    return this.http.post<Lote>(this.apiUrl, lote);
  }

  atualizar(id: number, lote: LoteRequest): Observable<Lote> {
    return this.http.put<Lote>(`${this.apiUrl}/${id}`, lote);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
