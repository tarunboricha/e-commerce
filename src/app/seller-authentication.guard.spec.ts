import { TestBed } from '@angular/core/testing';

import { SellerAuthenticationGuard } from './seller-authentication.guard';

describe('SellerAuthenticationGuard', () => {
  let guard: SellerAuthenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SellerAuthenticationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
