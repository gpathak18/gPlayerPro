import { TestBed, inject } from '@angular/core/testing';

import { LibraryResolverService } from './library-resolver.service';

describe('LibraryResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LibraryResolverService]
    });
  });

  it('should be created', inject([LibraryResolverService], (service: LibraryResolverService) => {
    expect(service).toBeTruthy();
  }));
});
