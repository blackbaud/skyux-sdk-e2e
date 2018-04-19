import { SkyVisualCompareScreenshotConfig } from './visual-compare-screenshot-config';

const logger = require('@blackbaud/skyux-logger');
const PixDiff = require('pix-diff');
const { browser, by, element } = require('protractor');

const defaultPixDiffConfig = {
  basePath: 'screenshots-baseline-local',
  baseline: true,
  createdPath: 'screenshots-created-local',
  createdPathDiff: 'screenshots-created-diff-local',
  diffPath: 'screenshots-diff-local',
  height: 800,
  width: 1000
};

function getComparator() {
  let config: any;

  if (browser.skyVisualConfig) {
    config = Object.assign(
      {},
      defaultPixDiffConfig,
      browser.skyVisualConfig.compareScreenshot
    );
  } else {
    config = defaultPixDiffConfig;
  }

  return new PixDiff(config);
}

export abstract class SkyVisual {
  private static comparator: any;

  public static compareScreenshot(config: SkyVisualCompareScreenshotConfig) {
    if (!SkyVisual.comparator) {
      SkyVisual.comparator = getComparator();
    }

    const selector = config.selector || 'body';
    const subject = element(by.css(selector));

    return SkyVisual.comparator
      .checkRegion(
        subject,
        config.screenshotName,
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

        expect(isSimilar).toEqual(true, message);
      })
      .catch((error: any) => {
        // Ignore 'baseline image not found' errors from PixDiff.
        if (error.message.indexOf('saving current image') > -1) {
          logger.info(`[${config.screenshotName}]`, error.message);
          return Promise.resolve();
        }

        throw error;
      });
  }
}
