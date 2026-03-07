import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartBinButton } from './bin-button';

describe('BinButton', () => {
  let component: CartBinButton;
  let fixture: ComponentFixture<CartBinButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartBinButton],
    }).compileComponents();

    fixture = TestBed.createComponent(CartBinButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
