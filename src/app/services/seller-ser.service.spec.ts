import { TestBed } from '@angular/core/testing';

import { SellerSerService } from './seller-ser.service';

describe('SellerSerService', () => {
  let service: SellerSerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellerSerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
