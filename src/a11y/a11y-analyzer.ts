import {
  SkyA11yAnalyzerConfig
} from './a11y-analyzer-config';

const axeBuilder = require('axe-webdriverjs');
const axeConfig = require('@blackbaud/skyux-builder/config/axe/axe.config');
const logger = require('@blackbaud/skyux-logger');

export abstract class SkyA11yAnalyzer {
  private static browser = require('protractor').browser;

  public static run(selector: string, config?: SkyA11yAnalyzerConfig): Promise<any> {
    return new Promise((resolve, reject) => {
        const defaults = axeConfig.getConfig();
        const settings = Object.assign({}, defaults, config);

        axeBuilder(SkyA11yAnalyzer.browser.driver)
          .include(selector)
          .options(settings)
          .analyze((results: any) => {
            const numViolations = results.violations.length;
            const subject = (numViolations === 1) ? 'violation' : 'violations';

            logger.info(`Accessibility checks finished with ${numViolations} ${subject}.\n`);

            if (numViolations > 0) {
              const message = SkyA11yAnalyzer.parseMessage(results.violations);
              reject(new Error(message));
            }

            resolve();
          });
      });
  }

  private static parseMessage(violations: any[]): string {
    let message = 'Expected element to pass accessibility checks.\n\n';

    violations.forEach((violation: any) => {
      const wcagTags = violation.tags
        .filter((tag: any) => tag.match(/wcag\d{3}|^best*/gi))
        .join(', ');

      const html = violation.nodes.reduce((accumulator: string, node: any) => {
        return `${accumulator}\n${node.html}\n`;
      }, '       Elements:\n');

      const error = [
        `aXe - [Rule: \'${violation.id}\'] ${violation.help} - WCAG: ${wcagTags}`,
        `       Get help at: ${violation.helpUrl}\n`,
        `${html}\n\n`
      ].join('\n');

      message += `${error}\n`;
    });

    return message;
  }
}
