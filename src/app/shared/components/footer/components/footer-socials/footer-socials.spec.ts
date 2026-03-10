import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSocials } from './footer-socials';

describe('FooterSocials', () => {
  let component: FooterSocials;
  let fixture: ComponentFixture<FooterSocials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterSocials],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterSocials);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
