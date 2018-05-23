import rewiremock from 'rewiremock';

import { MockPixDiff } from './fixtures/mock-pix-diff';
import { MockPixDiffFactory } from './fixtures/mock-pix-diff-factory';

(rewiremock('@blackbaud/skyux-logger').with({}) as any).dynamic();
(rewiremock('pix-diff').with(MockPixDiffFactory) as any).dynamic();
(rewiremock('protractor').with({}) as any).dynamic();
rewiremock.enable();

import { SkyVisual } from './visual';

describe('SkyVisual', () => {
  let mockLogger: any;
  let mockPixDiff: any;
  let mockProtractor: any;

  beforeEach(() => {
    mockLogger = {
      info(): void {}
    };

    mockPixDiff = new MockPixDiff();

    mockProtractor = {
      browser: {
        skyVisualConfig: {
          foo: 'bar'
        }
      },
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
    rewiremock.disable();
  });

  function applyMocks(): void {
    rewiremock.getMock('@blackbaud/skyux-logger').with(mockLogger);
    rewiremock.getMock('protractor').with(mockProtractor);
    MockPixDiffFactory.instance = mockPixDiff;
    rewiremock.getMock('pix-diff').with(MockPixDiffFactory);
  }

  it('should compare similar screenshots', (done) => {
    applyMocks();
    SkyVisual.compareScreenshot('foo').then((result: any) => {
      expect(result.isSimilar).toEqual(true);
      expect(result.message).toEqual('Screenshots are similar.');
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

    SkyVisual.compareScreenshot('foo').then((result: any) => {
      expect(result.isSimilar).toEqual(false);
      expect(result.message).toEqual('Screenshots have mismatch of 50.00 percent!');
      done();
    });
  });

  it('should extend config', (done) => {
    mockProtractor.browser.skyVisualConfig.compareScreenshot = {
      width: 1200
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

    SkyVisual.compareScreenshot('foo').then((result: any) => {
      expect(result.isSimilar).toEqual(true);
      expect(result.message).toEqual('[foo] saving current image');
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

  describe('matchers', () => {
    it('should allow custom matchers', () => {
      expect({ isSimilar: true, message: '' }).toMatchBaselineScreenshot();
      expect({ isSimilar: false, message: '' }).not.toMatchBaselineScreenshot();
    });
  });
});
