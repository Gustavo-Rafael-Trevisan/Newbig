import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoteRequest } from '../../../services/estoque/estoque.service';
import { Produto } from '../../../services/produtos/produto.service';

@Component({
  selector: 'app-estoque-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estoque-details.component.html',
  styleUrl: './estoque-details.component.scss'
})
export class EstoqueDetailsComponent {
  @Input() modalAberto = false;
  @Input() modoEdicao = false;
  @Input() produtos: Produto[] = [];
  @Input() lote: LoteRequest = this.loteVazio();
  @Output() fechar = new EventEmitter<void>();
  @Output() salvarLote = new EventEmitter<LoteRequest>();

  fecharModal(): void { this.fechar.emit(); }

  salvar(): void {
    if (!this.lote.batchCode.trim() || !this.lote.productId || !this.lote.expirationAt || this.lote.quantity < 1) return;
    this.salvarLote.emit({ ...this.lote, batchCode: this.lote.batchCode.trim() });
  }

  private loteVazio(): LoteRequest {
    return { batchCode: '', quantity: 1, productId: 0, expirationAt: '' };
  }
}
