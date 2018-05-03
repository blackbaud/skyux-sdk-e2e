import {
  SkyVisualCompareScreenshotConfig
} from './types';

import { SkyVisual } from './visual';

const globalRef: any = global;

const SkyVisualMatchers: jasmine.CustomMatcherFactories = {
  toMatchBaseline(): any {
    return {
      compare(
        selector: string,
        config: SkyVisualCompareScreenshotConfig,
        callback: () => void
      ): jasmine.CustomMatcherResult {
        SkyVisual.compareScreenshot(config)
          .then(() => {
            if (callback) {
              callback();
            }
          })
          .catch((err) => {
            globalRef.fail(err.message);
          });

        return {
          message: '',
          pass: true
        };
      }
    };
  }
};

if (globalRef.beforeEach) {
  globalRef.beforeEach(() => {
    globalRef.jasmine.addMatchers(SkyVisualMatchers);
  });
}

export const expect: () => any = globalRef.expect;
