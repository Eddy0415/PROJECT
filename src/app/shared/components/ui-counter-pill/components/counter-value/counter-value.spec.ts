import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterValue } from './counter-value';

describe('CounterValue', () => {
  let component: CounterValue;
  let fixture: ComponentFixture<CounterValue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterValue],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterValue);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
