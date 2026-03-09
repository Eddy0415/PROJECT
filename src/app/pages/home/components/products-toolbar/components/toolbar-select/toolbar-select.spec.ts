import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarSelect } from './toolbar-select';

describe('ToolbarSelect', () => {
  let component: ToolbarSelect;
  let fixture: ComponentFixture<ToolbarSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
