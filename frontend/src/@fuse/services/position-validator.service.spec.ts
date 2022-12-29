import { TestBed } from '@angular/core/testing';

import { PositionValidatorService } from './position-validator.service';

describe('PositionValidatorService', () => {
  let service: PositionValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PositionValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
