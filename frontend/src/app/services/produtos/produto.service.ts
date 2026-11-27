import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  id?: number;
  name: string;
  description: string;
  barcode: string;
  category: string;
  minimumStock: number;
  active: boolean;
  salePrice: number;
  costPrice: number;
  unitType?: string;
  productType?: string;
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/product';

  getAllProducts(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  createProduct(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  updateProduct(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
