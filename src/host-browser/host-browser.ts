import {
  SkyHostBrowserBreakpoint
} from './host-browser-breakpoint';

export abstract class SkyHostBrowser {
  private static hostUtils = require('@blackbaud/skyux-builder/utils/host-utils');
  private static protractor = require('protractor');

  public static get(
    url: string,
    timeout = 0
  ): Promise<any> {
    const params = SkyHostBrowser.protractor.browser.params;
    const destination = SkyHostBrowser.hostUtils.resolve(
      url,
      params.localUrl,
      params.chunks,
      params.skyPagesConfig
    );

    return SkyHostBrowser.protractor.browser.get(destination, timeout);
  }

  public static moveCursorOffScreen(): void {
    const moveToElement = SkyHostBrowser.querySelector('body');
    SkyHostBrowser.protractor.browser.actions()
      .mouseMove(moveToElement, { x: 0, y: 0 })
      .perform();
  }

  public static querySelector(selector: string): any {
    return SkyHostBrowser.protractor.element(
      SkyHostBrowser.protractor.by.css(selector)
    ).getWebElement();
  }

  public static setWindowDimensions(
    width: number,
    height: number
  ): void {
    SkyHostBrowser.protractor.browser.driver
      .manage()
      .window()
      .setSize(width, height);
  }

  public static setWindowBreakpoint(breakpoint?: SkyHostBrowserBreakpoint): void {
    let width;
    let height;

    switch (breakpoint) {
      case 'xs':
        width = 480;
        height = 800;
        break;
      case 'sm':
        width = 768;
        height = 800;
        break;
      case 'md':
        width = 992;
        height = 800;
        break;
      default:
      case 'lg':
        width = 1200;
        height = 800;
        break;
    }

    SkyHostBrowser.setWindowDimensions(width, height);
  }

  public static scrollTo(selector: string): void {
    const elem = SkyHostBrowser.querySelector(selector);
    SkyHostBrowser.protractor.browser.executeScript('arguments[0].scrollIntoView();', elem);
  }
}
