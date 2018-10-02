import { GdriveHandlerModule } from './gdrive-handler.module';

describe('GdriveHandlerModule', () => {
  let gdriveHandlerModule: GdriveHandlerModule;

  beforeEach(() => {
    gdriveHandlerModule = new GdriveHandlerModule();
  });

  it('should create an instance', () => {
    expect(gdriveHandlerModule).toBeTruthy();
  });
});
