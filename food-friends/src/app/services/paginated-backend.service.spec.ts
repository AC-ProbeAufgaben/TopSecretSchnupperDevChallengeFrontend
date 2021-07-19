import { TestBed } from '@angular/core/testing';

import { PaginatedBackendService } from './paginated-backend.service';

describe('PaginatedBackendService', () => {
  let service: PaginatedBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginatedBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
