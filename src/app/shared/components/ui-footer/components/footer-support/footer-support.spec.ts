import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSupport } from './footer-support';

describe('FooterSupport', () => {
  let component: FooterSupport;
  let fixture: ComponentFixture<FooterSupport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterSupport],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterSupport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
