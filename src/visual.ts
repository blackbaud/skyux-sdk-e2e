import {
  SkyVisualCompareScreenshotConfig,
  SkyVisualCompareScreenshotResult
} from './types';

// Apply jasmine matchers as a side effect when this file is imported into a spec.
import './matchers';

const logger = require('@blackbaud/skyux-logger');
const PixDiff = require('pix-diff');
const protractor = require('protractor');

export abstract class SkyVisual {
  public static compareScreenshot(
    screenshotName: string,
    config?: SkyVisualCompareScreenshotConfig
  ): Promise<SkyVisualCompareScreenshotResult> {
    if (!protractor.browser.pixDiff) {
      protractor.browser.pixDiff = SkyVisual.createComparator();
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
        const isSimilar = (
          results.code === PixDiff.RESULT_SIMILAR ||
          results.code === PixDiff.RESULT_IDENTICAL
        );

        let message: string;
        if (isSimilar) {
          message = 'Screenshots are similar.';
        } else {
          const mismatchPercentage = (results.differences / results.dimension * 100).toFixed(2);
          message = `Screenshots have mismatch of ${mismatchPercentage} percent!`;
        }

        return {
          isSimilar,
          message
        };
      })
      .catch((error: any) => {
        // Ignore 'baseline image not found' errors from PixDiff.
        if (error.message.indexOf('saving current image') > -1) {
          const message = `[${screenshotName}] ${error.message}`;

          // Wait for a tick so that the log is printed beneath the
          // spec's heading in the console.
          setTimeout(() => {
            logger.info(message);
          });

          return Promise.resolve({
            isSimilar: true,
            message
          });
        }

        throw error;
      });
  }

  private static createComparator(): any {
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
}
