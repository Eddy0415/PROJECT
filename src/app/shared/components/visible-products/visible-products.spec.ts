import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleProducts } from './visible-products';

describe('VisibleProducts', () => {
  let component: VisibleProducts;
  let fixture: ComponentFixture<VisibleProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisibleProducts],
    }).compileComponents();

    fixture = TestBed.createComponent(VisibleProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
