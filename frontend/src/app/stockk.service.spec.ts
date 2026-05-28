import { TestBed } from '@angular/core/testing';

import { StockkService } from './stockk.service';

describe('StockkService', () => {
  let service: StockkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
