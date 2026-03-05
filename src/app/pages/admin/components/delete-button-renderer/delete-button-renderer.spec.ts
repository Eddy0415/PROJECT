import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteButtonRendererComponent } from './delete-button-renderer';

describe('DeleteButtonRenderer', () => {
  let component: DeleteButtonRendererComponent;
  let fixture: ComponentFixture<DeleteButtonRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteButtonRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteButtonRendererComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
