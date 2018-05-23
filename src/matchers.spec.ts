import {
  cleanupTests,
  prepareTest
} from './shared/prepare-test';

prepareTest();

import {
  SkyVisual
} from './visual';

import {
  expect
} from './matchers';

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
    const spy = spyOn(SkyVisual, 'compareScreenshot').and.callFake(() => {
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
});
