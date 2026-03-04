import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCounterPill } from './ui-counter-pill';

describe('UiCounterPill', () => {
  let component: UiCounterPill;
  let fixture: ComponentFixture<UiCounterPill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCounterPill]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiCounterPill);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
