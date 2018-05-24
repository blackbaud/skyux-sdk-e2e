import {
  SkyVisual
} from './visual';

import {
  SkyVisualCompareScreenshotConfig
} from './visual-compare-screenshot-config';

const globalRef: any = global;

const SkyVisualMatchers: jasmine.CustomMatcherFactories = {
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

globalRef.beforeEach(() => {
  globalRef.jasmine.addMatchers(SkyVisualMatchers);
});

export const expect: (actual: any) => any = globalRef.expect;
