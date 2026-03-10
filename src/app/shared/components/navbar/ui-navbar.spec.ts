import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiNavbarComponent } from './ui-navbar';

describe('UiNavbarComponent', () => {
  let component: UiNavbarComponent;
  let fixture: ComponentFixture<UiNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiNavbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
