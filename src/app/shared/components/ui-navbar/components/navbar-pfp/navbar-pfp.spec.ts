import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPfp } from './navbar-pfp';

describe('NavbarPfp', () => {
  let component: NavbarPfp;
  let fixture: ComponentFixture<NavbarPfp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarPfp],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarPfp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
