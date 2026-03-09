import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterLinkCol } from './footer-link-col';

describe('FooterLinkCol', () => {
  let component: FooterLinkCol;
  let fixture: ComponentFixture<FooterLinkCol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterLinkCol],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterLinkCol);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
