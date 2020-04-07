import * as axe from 'axe-core';

import {
  SkyA11yConfig
} from './a11y-config';

function getAxeConfig(): SkyA11yConfig {
  const skyPagesConfigUtil = require('@skyux-sdk/builder/config/sky-pages/sky-pages.config');
  const skyPagesConfig = skyPagesConfigUtil.getSkyPagesConfig();

  const defaults: SkyA11yConfig = {
    rules: { }
  };

  // Enable all rules by default.
  axe.getRules().forEach((rule) => {
    defaults.rules[rule.ruleId] = { enabled: true };
  });

  const config: SkyA11yConfig = {
    rules: { }
  };

  // Merge rules from skyux config.
  if (skyPagesConfig.skyux.a11y && skyPagesConfig.skyux.a11y.rules) {
    config.rules = {...defaults.rules, ...skyPagesConfig.skyux.a11y.rules};
  } else if (skyPagesConfig.skyux.a11y === false) {
    // The consuming SPA wishes to disable all rules.
    config.rules = Object.assign({}, defaults.rules);
    Object.keys(config.rules).forEach((key) => {
      config.rules[key].enabled = false;
    });
  }

  if (!config.rules) {
    return defaults;
  }

  return config;
}

export abstract class SkyA11y {

  private static axeBuilder: any = require('axe-webdriverjs');

  private static protractor = require('protractor');

  private static logger = require('@blackbaud/skyux-logger');

  public static run(): Promise<any> {

    const axeConfig: axe.RunOptions = getAxeConfig();

    return this.protractor.browser.getCurrentUrl().then((url: string) => {
      return new Promise((resolve) => {
        this.logger.info(`Starting accessibility checks for ${url}...`);

        this.axeBuilder(this.protractor.browser.driver)
          .options(axeConfig)
          .analyze((results: any) => {
            const numViolations = results.violations.length;
            const subject = (numViolations === 1) ? 'violation' : 'violations';

            this.logger.info(`Accessibility checks finished with ${numViolations} ${subject}.\n`);

            if (numViolations > 0) {
              this.logViolations(results);
            }

            resolve(numViolations);
          });
      });
    });
  }

  private static logViolations(results: any): void {
    results.violations.forEach((violation: any) => {
      const wcagTags = violation.tags
        .filter((tag: string) => tag.match(/wcag\d{3}|^best*/gi))
        .join(', ');

      const html = violation.nodes
        .reduce(
          (accumulator: string, node: any) => `${accumulator}\n${node.html}\n`,
          '       Elements:\n'
        );

      const error = [
        `aXe - [Rule: \'${violation.id}\'] ${violation.help} - WCAG: ${wcagTags}`,
        `       Get help at: ${violation.helpUrl}\n`,
        `${html}\n\n`
      ].join('\n');

      this.logger.error(error);
    });
  }
}
