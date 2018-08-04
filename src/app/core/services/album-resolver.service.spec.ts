import { TestBed, inject } from '@angular/core/testing';

import { AlbumResolverService } from './album-resolver.service';

describe('AlbumResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlbumResolverService]
    });
  });

  it('should be created', inject([AlbumResolverService], (service: AlbumResolverService) => {
    expect(service).toBeTruthy();
  }));
});
