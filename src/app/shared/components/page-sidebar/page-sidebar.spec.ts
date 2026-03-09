import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSidebar } from './page-sidebar';

describe('PageSidebar', () => {
  let component: PageSidebar;
  let fixture: ComponentFixture<PageSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(PageSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
