import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFooter } from './ui-footer';

describe('UiFooter', () => {
  let component: UiFooter;
  let fixture: ComponentFixture<UiFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
