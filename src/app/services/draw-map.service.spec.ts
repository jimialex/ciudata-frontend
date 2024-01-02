import { TestBed } from '@angular/core/testing';

import { DrawMapService } from './draw-map.service';

describe('DrawMapService', () => {
  let service: DrawMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
