import { FileHandlerModule } from './file-handler.module';

describe('FileHandlerModule', () => {
  let fileHandlerModule: FileHandlerModule;

  beforeEach(() => {
    fileHandlerModule = new FileHandlerModule();
  });

  it('should create an instance', () => {
    expect(fileHandlerModule).toBeTruthy();
  });
});
