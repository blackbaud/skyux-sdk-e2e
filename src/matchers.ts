import {
  SkyA11yAnalyzer,
  SkyA11yConfig
} from './a11y';

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
        config: SkyVisualCompareScreenshotConfig,
        callback: () => void = () => {}
      ): jasmine.CustomMatcherResult {

        SkyVisual.compareScreenshot(config)
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
  },

  toBeAccessible(): jasmine.CustomMatcher {
    return {
      compare(
        selector: string,
        callback: () => void = () => {},
        config?: SkyA11yConfig
      ): jasmine.CustomMatcherResult {

        const result: any = {
          message: '',
          pass: true
        };

        SkyA11yAnalyzer.run(selector)
          .then(() => callback())
          .catch((err: any) => {
            globalRef.fail(err.message);
            callback();
          });

        // Asynchronous matchers are currently unsupported, but
        // the method above works to fail the specific test in the
        // callback manually, if checks do not pass.
        // ---
        // A side effect of this technique is the matcher cannot be
        // paired with a `.not.toBeA11y` operator (since the returned
        // result is always `true`). For this particular matcher,
        // checking if an element is not accessible may be irrelevant.
        return result;
      }
    };
  }
};

globalRef.beforeEach(() => {
  globalRef.jasmine.addMatchers(SkyE2EMatchers);
});

export const expect: (actual: any) => any = globalRef.expect;
