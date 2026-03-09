import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCart } from './navbar-cart';

describe('NavbarCart', () => {
  let component: NavbarCart;
  let fixture: ComponentFixture<NavbarCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarCart],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarCart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
