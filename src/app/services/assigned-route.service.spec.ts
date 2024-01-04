import { TestBed } from '@angular/core/testing';

import { AssignedRouteService } from './assigned-route.service';

describe('AssignedRouteService', () => {
  let service: AssignedRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignedRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
