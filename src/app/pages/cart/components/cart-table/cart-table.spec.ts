import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartTable } from './cart-table';

describe('CartTable', () => {
  let component: CartTable;
  let fixture: ComponentFixture<CartTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartTable],
    }).compileComponents();

    fixture = TestBed.createComponent(CartTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
