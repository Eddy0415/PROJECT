import { TestBed } from '@angular/core/testing';

import { SigninSignupService } from './signin-signup-service';

describe('SigninSignupService', () => {
  let service: SigninSignupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SigninSignupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
