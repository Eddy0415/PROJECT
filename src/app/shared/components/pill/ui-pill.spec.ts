import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiPill } from './ui-pill';

describe('UiPill', () => {
  let component: UiPill;
  let fixture: ComponentFixture<UiPill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiPill]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiPill);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
