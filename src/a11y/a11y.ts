const axeBuilder = require('axe-webdriverjs');
const axeConfig = require('@blackbaud/skyux-builder/config/axe/axe.config');
const logger = require('@blackbaud/skyux-logger');

export abstract class SkyA11yAnalyzer {
  private static browser = require('protractor').browser;

  public static run(selector: string): Promise<number> {
    return SkyA11yAnalyzer.browser.getCurrentUrl()
      .then((url: string) => new Promise((resolve) => {
        const config = axeConfig.getConfig();

        logger.info(`Starting accessibility checks for ${url}...`);

        axeBuilder(SkyA11yAnalyzer.browser.driver)
          .include(selector)
          .options(config)
          .analyze((results: any) => {
            const numViolations = results.violations.length;
            const subject = (numViolations === 1) ? 'violation' : 'violations';

            logger.info(`Accessibility checks finished with ${numViolations} ${subject}.\n`);

            if (numViolations > 0) {
              SkyA11yAnalyzer.logViolations(results);
            }

            resolve(numViolations);
          });
      }));
  }

  private static logViolations(violations: any[]): void {
    violations.forEach((violation) => {
      const wcagTags = violation.tags
        .filter((tag: string) => tag.match(/wcag\d{3}|^best*/gi))
        .join(', ');

      const html = violation.nodes.reduce((accumulator: string, node: any) => {
        return `${accumulator}\n${node.html}\n`;
      }, '       Elements:\n');

      const error = [
        `aXe - [Rule: \'${violation.id}\'] ${violation.help} - WCAG: ${wcagTags}`,
        `       Get help at: ${violation.helpUrl}\n`,
        `${html}\n\n`
      ].join('\n');

      logger.error(error);
    });
  }
}
