import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiNavbar } from './ui-navbar';

describe('UiNavbar', () => {
  let component: UiNavbar;
  let fixture: ComponentFixture<UiNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
