import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstoqueDetailsComponent } from '../estoque-details/estoque-details.component';
import { EstoqueService, Lote, LoteRequest } from '../../../services/estoque/estoque.service';
import { Produto, ProdutoService } from '../../../services/produtos/produto.service';

@Component({
  selector: 'app-estoque-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EstoqueDetailsComponent],
  templateUrl: './estoque-list.component.html',
  styleUrl: './estoque-list.component.scss'
})
export class EstoqueListComponent implements OnInit {
  private readonly estoqueService = inject(EstoqueService);
  private readonly produtoService = inject(ProdutoService);

  termoBusca = '';
  modalAberto = false;
  modoEdicao = false;
  carregando = true;
  erro = '';
  lotes: Lote[] = [];
  produtos: Produto[] = [];
  loteSelecionado: LoteRequest = this.loteVazio();
  loteEditandoId: number | null = null;

  ngOnInit(): void {
    this.carregarLotes();
    this.produtoService.getAllProducts().subscribe({
      next: produtos => this.produtos = produtos.filter(produto => produto.active),
      error: () => this.erro = 'Não foi possível carregar os produtos para o cadastro de lotes.'
    });
  }

  get lotesFiltrados(): Lote[] {
    const busca = this.termoBusca.trim().toLocaleLowerCase('pt-BR');
    if (!busca) return this.lotes;
    return this.lotes.filter(lote =>
      lote.batchCode.toLocaleLowerCase('pt-BR').includes(busca) ||
      lote.productName.toLocaleLowerCase('pt-BR').includes(busca)
    );
  }

  novoLote(): void {
    this.modoEdicao = false;
    this.loteEditandoId = null;
    this.loteSelecionado = this.loteVazio();
    this.modalAberto = true;
  }

  editarLote(lote: Lote): void {
    const produto = this.produtos.find(item => Number(item.id) === lote.productId);
    if (!produto) {
      this.erro = 'Não foi possível identificar o produto deste lote.';
      return;
    }
    this.modoEdicao = true;
    this.loteEditandoId = lote.id;
    this.loteSelecionado = {
      batchCode: lote.batchCode,
      quantity: lote.quantity,
      productId: Number(produto.id),
      expirationAt: lote.expirationAt
    };
    this.modalAberto = true;
  }

  salvarLote(lote: LoteRequest): void {
    const request = this.modoEdicao && this.loteEditandoId !== null
      ? this.estoqueService.atualizar(this.loteEditandoId, lote)
      : this.estoqueService.criar(lote);
    request.subscribe({
      next: () => { this.fecharModal(); this.carregarLotes(); },
      error: err => this.erro = err?.error?.message ?? 'Não foi possível salvar o lote. Confira os dados e tente novamente.'
    });
  }

  excluirLote(lote: Lote): void {
    if (!window.confirm(`Excluir o lote ${lote.batchCode}?`)) return;
    this.estoqueService.excluir(lote.id).subscribe({
      next: () => this.carregarLotes(),
      error: err => this.erro = err?.error?.message ?? 'Não foi possível excluir o lote.'
    });
  }

  fecharModal(): void { this.modalAberto = false; }

  status(lote: Lote): string {
    if (lote.expiration) return 'Vencido';
    if (lote.quantityIsZero || lote.quantity === 0) return 'Esgotado';
    return 'Disponível';
  }

  private carregarLotes(): void {
    this.carregando = true;
    this.estoqueService.listar().subscribe({
      next: lotes => { this.lotes = lotes; this.carregando = false; this.erro = ''; },
      error: () => { this.carregando = false; this.erro = 'Não foi possível carregar o estoque. Verifique se o backend está ativo.'; }
    });
  }

  private loteVazio(): LoteRequest {
    return { batchCode: '', quantity: 1, productId: 0, expirationAt: '' };
  }
}
