import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Produto, ProdutoService } from '../../../services/produtos/produto.service';

@Component({
  selector: 'app-lista-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-produtos.component.html',
  styleUrl: './lista-produtos.component.scss'
})
export class ListaProdutosComponent implements OnInit {
  private readonly produtoService = inject(ProdutoService);

  produtos: Produto[] = [];
  termoBusca = '';
  carregando = true;
  salvando = false;
  erro = '';
  erroFormulario = '';
  modalAberto = false;
  modalStatusAberto = false;
  modoEdicao = false;
  produtoParaAlterarStatus: Produto | null = null;
  produto: Produto = this.novoProdutoVazio();
  paginaAtual = 1;
  readonly itensPorPagina = 7;

  ngOnInit(): void {
    this.carregarProdutos();
  }

  get produtosFiltrados(): Produto[] {
    const termo = this.termoBusca.trim().toLocaleLowerCase('pt-BR');
    if (!termo) return this.produtos;

    return this.produtos.filter(item =>
      item.name.toLocaleLowerCase('pt-BR').includes(termo) ||
      item.barcode.toLocaleLowerCase('pt-BR').includes(termo) ||
      item.category.toLocaleLowerCase('pt-BR').includes(termo)
    );
  }

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.produtosFiltrados.length / this.itensPorPagina));
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, index) => index + 1);
  }

  get produtosDaPagina(): Produto[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.produtosFiltrados.slice(inicio, inicio + this.itensPorPagina);
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.erro = '';
    this.produtoService.getAllProducts().subscribe({
      next: produtos => {
        this.produtos = produtos;
        this.paginaAtual = Math.min(this.paginaAtual, this.totalPaginas);
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os produtos. Verifique se o backend está ativo.';
        this.carregando = false;
      }
    });
  }

  buscar(termo: string): void {
    this.termoBusca = termo;
    this.paginaAtual = 1;
  }

  abrirModal(): void {
    this.modoEdicao = false;
    this.erroFormulario = '';
    this.produto = this.novoProdutoVazio();
    this.modalAberto = true;
  }

  editarProduto(produto: Produto): void {
    this.modoEdicao = true;
    this.erroFormulario = '';
    this.produto = { ...produto };
    this.modalAberto = true;
  }

  fecharModal(): void {
    if (this.salvando) return;
    this.modalAberto = false;
    this.erroFormulario = '';
  }

  salvarProduto(): void {
    if (this.salvando) return;

    const dados = {
      ...this.produto,
      name: this.produto.name.trim(),
      description: this.produto.description.trim(),
      barcode: this.produto.barcode.trim(),
      category: this.produto.category.trim()
    };

    this.erroFormulario = '';
    if (this.modoEdicao && dados.id === undefined) {
      this.erroFormulario = 'Não foi possível identificar o produto para salvar as alterações.';
      return;
    }

    this.salvando = true;
    const requisicao = dados.id !== undefined
      ? this.produtoService.updateProduct(dados.id, dados)
      : this.produtoService.createProduct(dados);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.modalAberto = false;
        this.carregarProdutos();
      },
      error: () => {
        this.salvando = false;
        this.erroFormulario = 'Não foi possível salvar o produto. Confira os dados e tente novamente.';
      }
    });
  }

  abrirModalStatus(produto: Produto): void {
    this.produtoParaAlterarStatus = produto;
    this.modalStatusAberto = true;
  }

  fecharModalStatus(): void {
    this.modalStatusAberto = false;
    this.produtoParaAlterarStatus = null;
  }

  confirmarAlteracaoStatus(): void {
    const id = this.produtoParaAlterarStatus?.id;
    if (id === undefined) {
      this.erro = 'Não foi possível identificar o produto para alterar o status.';
      this.fecharModalStatus();
      return;
    }

    this.produtoService.deleteProduct(id).subscribe({
      next: () => {
        this.fecharModalStatus();
        this.carregarProdutos();
      },
      error: () => {
        this.erro = 'Não foi possível alterar o status do produto. Tente novamente.';
        this.fecharModalStatus();
      }
    });
  }

  private novoProdutoVazio(): Produto {
    return {
      name: '',
      description: '',
      barcode: '',
      category: '',
      minimumStock: 1,
      active: true,
      salePrice: 0,
      costPrice: 0
    };
  }
}
