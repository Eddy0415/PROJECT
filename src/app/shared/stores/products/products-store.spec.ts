import { TestBed } from '@angular/core/testing';

import { ProductsCatalogStore } from './products-store';

describe('ProductsCatalogStore', () => {
  let service: ProductsCatalogStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsCatalogStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
