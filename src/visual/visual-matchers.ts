import {
  SkyVisual
} from './visual';

import {
  SkyVisualCompareScreenshotConfig
} from './visual-compare-screenshot-config';

const globalRef: any = global;

const visualMatchers: jasmine.CustomMatcherFactories = {
  toMatchBaselineScreenshot(): jasmine.CustomMatcher {
    return {
      compare(
        selector: string,
        callback: () => void,
        config?: SkyVisualCompareScreenshotConfig
      ): jasmine.CustomMatcherResult {

        SkyVisual.compareScreenshot(selector, config)
          .then(() => callback())
          .catch((err) => {
            globalRef.fail(err.message);
            callback();
          });

        return {
          message: '',
          pass: true
        };
      }
    };
  }
};

const asyncVisualMatchers: jasmine.CustomAsyncMatcherFactories = {
  toMatchBaselineScreenshot(): jasmine.CustomAsyncMatcher {
    return {
      compare(
        selector: string,
        config?: SkyVisualCompareScreenshotConfig
      ): Promise<jasmine.CustomMatcherResult> {
        return new Promise((resolve) => {
          SkyVisual.compareScreenshot(selector, config)
            .then(() => {
              resolve({
                pass: true
              });
            })
            .catch((err) => {
              resolve({
                pass: false,
                message: err.message
              });
            });
        });
      }
    };
  }
};

globalRef.beforeEach(() => {
  jasmine.addMatchers(visualMatchers);
  jasmine.addAsyncMatchers(asyncVisualMatchers);
});

export interface SkyE2EMatchers<T> extends jasmine.Matchers<T> {

  /**
   * Checks if the provided selector matches the existing screenshot.
   * @deprecated Use `await expectAsync(selector).toMatchBaselineScreenshot()` instead.
   * @param callback The callback to execute after screenshot checks run.
   * @param config The config to pass to the screenshot comparator.
   */
  toMatchBaselineScreenshot(
    callback?: () => void,
    config?: SkyVisualCompareScreenshotConfig
  ): void;

}

export interface SkyE2EAsyncMatchers<T> {
  /**
   * Invert the matcher following this `expect`
   */
  not: SkyE2EAsyncMatchers<T>;

  /**
   * Checks if the provided selector matches the existing screenshot.
   * @param config The config to pass to the screenshot comparator.
   */
  toMatchBaselineScreenshot(
    config?: SkyVisualCompareScreenshotConfig
  ): Promise<jasmine.CustomMatcherResult>;

}

export function expect<T>(actual: T): SkyE2EMatchers<T> {
  return globalRef.expect(actual);
}

export function expectAsync<T>(actual: T): SkyE2EAsyncMatchers<T> {
  return globalRef.expectAsync(actual);
}
