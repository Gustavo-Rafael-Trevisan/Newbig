import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutoComponent } from './produto.component';

describe('ProdutoComponent', () => {
  let fixture: ComponentFixture<ProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoComponent);
    fixture.detectChanges();
  });

  it('should create the product page shell', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
