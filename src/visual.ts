import {
  SkyVisualCompareScreenshotConfig,
  SkyVisualCompareScreenshotResult
} from './types';

import { SkyVisualMatchers } from './matchers';

const logger = require('@blackbaud/skyux-logger');
const PixDiff = require('pix-diff');
const protractor = require('protractor');

function createComparator(): any {
  const defaults = {
    basePath: 'screenshots-baseline-local',
    baseline: true,
    createdPath: 'screenshots-created-local',
    createdPathDiff: 'screenshots-created-diff-local',
    diffPath: 'screenshots-diff-local',
    height: 800,
    width: 1000
  };

  const config = Object.assign(
    {},
    defaults,
    protractor.browser.skyVisualConfig &&
    protractor.browser.skyVisualConfig.compareScreenshot
  );

  return new PixDiff(config);
}

export abstract class SkyVisual {
  public static compareScreenshot(
    screenshotName: string,
    config?: SkyVisualCompareScreenshotConfig
  ): Promise<SkyVisualCompareScreenshotResult> {

    if (!protractor.browser.pixDiff) {
      protractor.browser.pixDiff = createComparator();
    }

    const defaults: SkyVisualCompareScreenshotConfig = {
      selector: 'body'
    };

    const settings = Object.assign({}, defaults, config);
    const subject = protractor.element(protractor.by.css(settings.selector));

    return protractor.browser.pixDiff
      .checkRegion(
        subject,
        screenshotName,
        {
          threshold: 0.02,
          thresholdType: PixDiff.THRESHOLD_PERCENT
        }
      )
      .then((results: any) => {
        const code = results.code;
        const mismatchPercentage = (results.differences / results.dimension * 100).toFixed(2);
        const message = `Screenshots have mismatch of ${mismatchPercentage} percent!`;

        const isSimilar = (
          code === PixDiff.RESULT_SIMILAR ||
          code === PixDiff.RESULT_IDENTICAL
        );

        return { isSimilar, message };
      })
      .catch((error: any) => {
        // Ignore 'baseline image not found' errors from PixDiff.
        if (error.message.indexOf('saving current image') > -1) {
          setTimeout(() => {
            logger.info(`[${screenshotName}] ${error.message}`);
          });

          return Promise.resolve({ isSimilar: true, message: '' });
        }

        throw error;
      });
  }

  public static loadMatchers() {
    const globalRef: any = global;
    globalRef.beforeEach(() => {
      globalRef.jasmine.addMatchers(SkyVisualMatchers);
    });
  }
}
