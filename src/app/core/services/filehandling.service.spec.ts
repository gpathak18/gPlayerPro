import { TestBed, inject } from '@angular/core/testing';

import { FilehandlingService } from './filehandling.service';

describe('FilehandlingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilehandlingService]
    });
  });

  it('should be created', inject([FilehandlingService], (service: FilehandlingService) => {
    expect(service).toBeTruthy();
  }));
});
