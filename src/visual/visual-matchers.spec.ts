import {
  cleanupTests,
  prepareTest
} from './fixtures';

prepareTest();

import {
  SkyVisual
} from './visual';

import {
  expect, expectAsync
} from './visual-matchers';

describe('SkyVisual', () => {
  afterAll(() => {
    cleanupTests();
  });

  it('should run the screenshot comparison tool', (done) => {
    const spy = spyOn(SkyVisual, 'compareScreenshot').and.callFake(() => {
      return Promise.resolve();
    });

    const config = {
      screenshotName: 'bar'
    };

    expect('foo').toMatchBaselineScreenshot(() => {
      expect(spy).toHaveBeenCalledWith('foo', config);
      done();
    }, config);
  });

  it('should handle screenshot comparison tool errors', (done) => {
    spyOn(SkyVisual, 'compareScreenshot').and.callFake(() => {
      return Promise.reject(new Error('some error'));
    });

    const failSpy = spyOn((global as any), 'fail').and.callFake((message: string) => {
      expect(message).toEqual('some error');
    });

    expect('foo').toMatchBaselineScreenshot(() => {
      expect(failSpy).toHaveBeenCalled();
      done();
    });
  });

  describe('async matchers', () => {

    it('should run the screenshot comparison tool', async () => {
      const spy = spyOn(SkyVisual, 'compareScreenshot').and.callFake(() => {
        return Promise.resolve();
      });

      const config = {
        screenshotName: 'bar'
      };

      await expectAsync('foo').toMatchBaselineScreenshot(config);

      expect(spy).toHaveBeenCalledWith('foo', config);
    });

    it('should handle screenshot comparison tool errors', async () => {
      spyOn(SkyVisual, 'compareScreenshot').and.callFake(() => {
        return Promise.reject(new Error('some error'));
      });

      await expectAsync('foo').not.toMatchBaselineScreenshot();
    });

  });
});
