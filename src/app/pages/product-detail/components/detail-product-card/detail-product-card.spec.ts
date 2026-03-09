import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProductCard } from './detail-product-card';

describe('DetailProductCard', () => {
  let component: DetailProductCard;
  let fixture: ComponentFixture<DetailProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailProductCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
