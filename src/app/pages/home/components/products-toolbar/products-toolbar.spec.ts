import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsToolbar } from './products-toolbar';

describe('ProductsToolbar', () => {
  let component: ProductsToolbar;
  let fixture: ComponentFixture<ProductsToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
