import {
  cleanupTests,
  MockPixDiff,
  MockPixDiffFactory,
  prepareTest,
  resetMock
} from './fixtures';

prepareTest();

import {
  SkyVisual
} from './visual';

describe('SkyVisual', () => {
  let mockLogger: any;
  let mockPixDiff: any;
  let mockProtractor: any;

  beforeEach(() => {
    mockLogger = {
      info(): void {},
      warn(): void {}
    };

    mockPixDiff = new MockPixDiff();

    mockProtractor = {
      browser: { },
      by: {
        css(selector: string): any {
          return selector;
        }
      },
      element(value: any): any {
        return value;
      }
    };
  });

  afterAll(() => {
    cleanupTests();
  });

  function applyMocks(): void {
    resetMock('@blackbaud/skyux-logger', mockLogger);

    MockPixDiffFactory.instance = mockPixDiff;
    resetMock('pix-diff', MockPixDiffFactory);

    resetMock('protractor', mockProtractor);
    mockProtractor.browser.pixDiff = SkyVisual.createComparator();
  }

  it('should compare similar screenshots', (done) => {
    applyMocks();
    SkyVisual.compareScreenshot().then((result: boolean) => {
      expect(result).toEqual(true);
      done();
    });
  });

  it('should compare different screenshots', (done) => {
    spyOn(mockPixDiff, 'checkRegion').and.returnValue(
      Promise.resolve({
        code: -1,
        differences: 1,
        dimension: 2
      })
    );

    applyMocks();

    SkyVisual.compareScreenshot('foo').catch((err: any) => {
      expect(err.message).toEqual(
        'Expected screenshots to match.\nScreenshots have mismatch of 50.00 percent!'
      );
      done();
    });
  });

  it('should default to checking the body element', (done) => {
    const spy = spyOn(mockPixDiff, 'checkRegion').and.callThrough();
    applyMocks();
    SkyVisual.compareScreenshot().then(() => {
      expect(spy.calls.first().args[0]).toEqual('body');
      done();
    });
  });

  it('should extend config', (done) => {
    mockProtractor.browser.skyE2E = {
      visualConfig: {
        compareScreenshot: {
          width: 1200
        }
      }
    };

    applyMocks();

    SkyVisual.compareScreenshot('foo').then((result: any) => {
      expect(MockPixDiffFactory.config.width).toEqual(1200);
      done();
    });
  });

  it('should reuse the comparator attached to the `browser` object', (done) => {
    mockProtractor.browser.pixDiff = new MockPixDiff();

    applyMocks();

    const createSpy = spyOn(SkyVisual as any, 'createComparator').and.callThrough();

    SkyVisual.compareScreenshot('foo').then((result: any) => {
      expect(createSpy).not.toHaveBeenCalled();
      done();
    });
  });

  it('should swallow PixDiff "saving current image" errors', (done) => {
    const loggerSpy = spyOn(mockLogger, 'info').and.callFake(() => {});

    spyOn(mockPixDiff, 'checkRegion').and.returnValue(
      Promise.reject(new Error(
        'saving current image'
      ))
    );

    applyMocks();

    SkyVisual.compareScreenshot('body', { screenshotName: 'foo' }).then(() => {
      setTimeout(() => {
        expect(loggerSpy).toHaveBeenCalledWith('[foo] saving current image');
        done();
      });
    });
  });

  it('should handle other errors', (done) => {
    spyOn(mockPixDiff, 'checkRegion').and.returnValue(
      Promise.reject(new Error(
        'something bad happened'
      ))
    );

    applyMocks();

    SkyVisual.compareScreenshot('foo').catch((error: any) => {
      expect(error.message).toEqual('something bad happened');
      done();
    });
  });

  it('should warn the consumer if a screenshot name is not provided', (done) => {
    const spy = spyOn(mockLogger, 'warn');

    applyMocks();

    SkyVisual.compareScreenshot().then((result: boolean) => {
      expect(result).toEqual(true);
      expect(spy).toHaveBeenCalled();
      done();
    });
  });

  it('should not warn the consumer if a screenshot name is provided', (done) => {
    const spy = spyOn(mockLogger, 'warn');

    applyMocks();

    SkyVisual.compareScreenshot('foo', {
      screenshotName: 'foo'
    }).then((result: boolean) => {
      expect(result).toEqual(true);
      expect(spy).not.toHaveBeenCalled();
      done();
    });
  });
});
