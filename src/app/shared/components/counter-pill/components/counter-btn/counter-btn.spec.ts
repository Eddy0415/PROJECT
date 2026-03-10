import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterBtn } from './counter-btn';

describe('CounterBtn', () => {
  let component: CounterBtn;
  let fixture: ComponentFixture<CounterBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterBtn],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterBtn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
