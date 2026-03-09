import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteButtonRenderer } from './delete-button-renderer';

describe('DeleteButtonRenderer', () => {
  let component: DeleteButtonRenderer;
  let fixture: ComponentFixture<DeleteButtonRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteButtonRenderer],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteButtonRenderer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
