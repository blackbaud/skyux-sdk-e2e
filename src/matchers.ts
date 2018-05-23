import {
  SkyVisual,
  SkyVisualCompareScreenshotConfig
} from './visual';

const globalRef: any = global;

const SkyE2EMatchers: jasmine.CustomMatcherFactories = {
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
  globalRef.jasmine.addMatchers(SkyE2EMatchers);
});

export const expect: (actual: any) => any = globalRef.expect;
