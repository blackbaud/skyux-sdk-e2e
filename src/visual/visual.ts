import {
  SkyVisualCompareScreenshotConfig
} from './visual-compare-screenshot-config';

const logger = require('@blackbaud/skyux-logger');
const PixDiff = require('pix-diff');

import {
  browser,
  by,
  element
} from 'protractor';

export abstract class SkyVisual {

  /**
   * Captures a new screenshot and compares it with an existing screenshot.
   * @param selector The CSS selector of the element to capture.
   * @param config The configuration to use for the screenshot capture.
   */
  public static compareScreenshot(
    selector: string,
    config: SkyVisualCompareScreenshotConfig
  ): Promise<any> {

    const subject = element(by.css(selector));
    const thresholdPercent = 0.02;

    if (!config.screenshotName) {
      throw new Error([
        'A unique screenshot name was not provided!\n',
        'To set the screenshot name for each test, add a config object to the matcher:\n',
        '`expect(\'.foobar\').toMatchBaselineScreenshot(done, { screenshotName: \'unique-name\' });`'
      ].join(' '));
    }

    return browser.pixDiff
      .checkRegion(
        subject,
        config.screenshotName,
        {
          threshold: thresholdPercent,
          thresholdType: PixDiff.THRESHOLD_PERCENT
        }
      )
      .then((results: any) => {
        const isSimilar = (
          results.code === PixDiff.RESULT_SIMILAR ||
          results.code === PixDiff.RESULT_IDENTICAL
        );

        if (!isSimilar) {
          const mismatchPercentage = (results.differences / results.dimension * 100).toFixed(2);
          const message = 'Expected screenshots to match.\n' +
            `Screenshots have mismatch of ${mismatchPercentage} percent!`;
          throw new Error(message);
        }

        return isSimilar;
      })
      .catch((error: any) => {
        // Ignore 'baseline image not found' errors from PixDiff.
        if (error.message.indexOf('saving current image') > -1) {
          const message = `[${config.screenshotName}] ${error.message}`;

          // Wait for a tick so that the log is printed beneath the
          // spec's heading in the console.
          setTimeout(() => {
            logger.info(message);
          });

          return;
        }

        throw error;
      });
  }

  public static createComparator(): any {
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
      browser.skyE2E &&
      browser.skyE2E.visualConfig &&
      browser.skyE2E.visualConfig.compareScreenshot
    );

    return new PixDiff(config);
  }
}

browser.pixDiff = SkyVisual.createComparator();
