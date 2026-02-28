import { TestBed } from '@angular/core/testing'; // test utilities
import { App } from './app'; // root component

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App], // standalone component import
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App); // create component
    const app = fixture.componentInstance; // get instance
    expect(app).toBeTruthy(); // should exist
  });
});
