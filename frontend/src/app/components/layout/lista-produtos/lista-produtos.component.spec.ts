import '@angular/common/locales/global/pt';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Produto, ProdutoService } from '../../../services/produtos/produto.service';
import { ListaProdutosComponent } from './lista-produtos.component';

describe('ListaProdutosComponent', () => {
  let component: ListaProdutosComponent;
  let fixture: ComponentFixture<ListaProdutosComponent>;
  let produtoService: jasmine.SpyObj<ProdutoService>;
  const produto: Produto = {
    id: 1,
    name: 'Sorvete de banana',
    description: 'Sorvete de banana',
    barcode: '1234567890123',
    category: 'Sorvete',
    minimumStock: 2,
    active: true,
    salePrice: 8.5,
    costPrice: 4
  };

  beforeEach(async () => {
    produtoService = jasmine.createSpyObj<ProdutoService>('ProdutoService', [
      'getAllProducts',
      'createProduct',
      'updateProduct',
      'deleteProduct'
    ]);
    produtoService.getAllProducts.and.returnValue(of([produto]));
    produtoService.createProduct.and.returnValue(of(produto));
    produtoService.updateProduct.and.returnValue(of(produto));
    produtoService.deleteProduct.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [ListaProdutosComponent],
      providers: [{ provide: ProdutoService, useValue: produtoService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens the product form from the new-product button', () => {
    const button = fixture.nativeElement.querySelector('.btn-novo') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#titulo-modal').textContent).toContain('Novo produto');
  });

  it('sends required API fields when creating a product', () => {
    component.abrirModal();
    component.produto = { ...produto, id: undefined };
    component.salvarProduto();

    expect(produtoService.createProduct).toHaveBeenCalledWith(jasmine.objectContaining({
      barcode: '1234567890123',
      minimumStock: 2,
      active: true
    }));
    expect(produtoService.getAllProducts).toHaveBeenCalledTimes(2);
  });
});
