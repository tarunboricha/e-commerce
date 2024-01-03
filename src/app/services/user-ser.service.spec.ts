import { TestBed } from '@angular/core/testing';

import { UserSerService } from './user-ser.service';

describe('UserSerService', () => {
  let service: UserSerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
