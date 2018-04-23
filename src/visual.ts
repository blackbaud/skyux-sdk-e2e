import { SkyVisualCompareScreenshotConfig } from './visual-compare-screenshot-config';
import { SkyVisualCompareScreenshotResult } from './visual-compare-screenshot-result';

const logger = require('@blackbaud/skyux-logger');
const PixDiff = require('pix-diff');
const protractor = require('protractor');

const defaultPixDiffConfig = {
  basePath: 'screenshots-baseline-local',
  baseline: true,
  createdPath: 'screenshots-created-local',
  createdPathDiff: 'screenshots-created-diff-local',
  diffPath: 'screenshots-diff-local',
  height: 800,
  width: 1000
};

function getComparator(): any {
  let config: any;
  if (protractor.browser.skyVisualConfig) {
    config = Object.assign(
      {},
      defaultPixDiffConfig,
      protractor.browser.skyVisualConfig.compareScreenshot
    );
  } else {
    config = defaultPixDiffConfig;
  }

  return new PixDiff(config);
}

function queryElement(selector: string): any {
  return protractor.element(protractor.by.css(selector));
}

export abstract class SkyVisual {
  private static comparator: any;

  public static compareScreenshot(
    screenshotName: string,
    config?: SkyVisualCompareScreenshotConfig
  ): Promise<SkyVisualCompareScreenshotResult> {
    if (!SkyVisual.comparator) {
      SkyVisual.comparator = getComparator();
    }

    const defaults = {
      selector: 'body'
    };

    const settings = Object.assign({}, defaults, config);
    const subject = queryElement(settings.selector);

    return SkyVisual.comparator
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
        const message = `Screenshots for "${screenshotName}" have mismatch of ${mismatchPercentage} percent!`;

        const isSimilar = (
          code === PixDiff.RESULT_SIMILAR ||
          code === PixDiff.RESULT_IDENTICAL
        );

        return { isSimilar, message } as SkyVisualCompareScreenshotResult;
      })
      .catch((error: any) => {
        // Ignore 'baseline image not found' errors from PixDiff.
        if (error.message.indexOf('saving current image') > -1) {
          logger.info(`[${screenshotName}]`, error.message);
          return Promise.resolve();
        }

        throw error;
      });
  }
}
