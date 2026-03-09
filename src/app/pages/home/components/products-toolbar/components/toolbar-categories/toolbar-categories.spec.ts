import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarCategories } from './toolbar-categories';

describe('ToolbarCategories', () => {
  let component: ToolbarCategories;
  let fixture: ComponentFixture<ToolbarCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarCategories],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
