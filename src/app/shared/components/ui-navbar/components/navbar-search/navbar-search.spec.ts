import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSearch } from './navbar-search';

describe('NavbarSearch', () => {
  let component: NavbarSearch;
  let fixture: ComponentFixture<NavbarSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
