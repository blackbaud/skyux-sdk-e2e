const protractor = require('protractor');

export abstract class SkyVisualThemeSelector {

  public static async selectTheme(theme: string, mode: string): Promise<void> {
    if (!await this.selectThemeByE2eSelector(theme, mode)) {
      await this.selectThemeByDocsSelector(theme, mode);
    }
  }

  private static async selectThemeByE2eSelector(theme: string, mode: string): Promise<boolean> {
    if (await protractor.browser.isElementPresent(protractor.by.css('.sky-e2e-theme-selector'))) {
      let optionValue = theme;

      if (theme === 'modern') {
        optionValue += `-${mode}`;
      }

      await protractor.element(
        protractor.by.css(`.sky-e2e-theme-selector option[value="${optionValue}"]`)
      ).click();

      return true;
    }

    return false;
  }

  private static async selectThemeByDocsSelector(theme: string, mode: string): Promise<void> {
    const themePanelEl = protractor.element(protractor.by.css('sky-docs-demo-control-panel-theme'));

    await themePanelEl
      .element(protractor.by.css(`sky-radio-group[name="theme"] input[value="${theme}"]`))
      .element(protractor.by.xpath('..'))
      .click();

    const modeEl = themePanelEl
      .element(protractor.by.css(`sky-radio-group[name="mode"] input[value="${mode}"]`))
      .element(protractor.by.xpath('..'));

    // Selecting a theme can cause the mode elements to change, so wait for the expected
    // mode option to be rendered before clicking it.
    await protractor.browser.wait(protractor.ExpectedConditions.presenceOf(modeEl), 1000);

    await modeEl.click();
  }

}
