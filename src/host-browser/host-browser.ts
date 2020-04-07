import {
  Ptor
} from 'protractor';

import {
  SkyHostBrowserBreakpoint
} from './host-browser-breakpoint';

export abstract class SkyHostBrowser {
  private static hostUtils = require('@skyux-sdk/builder/utils/host-utils');

  private static protractor: Ptor = require('protractor');

  public static async get(
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

    await SkyHostBrowser.protractor.browser.get(destination, timeout);
  }

  public static async moveCursorOffScreen(): Promise<void> {
    const moveToElement = SkyHostBrowser.querySelector('body');
    await SkyHostBrowser.protractor.browser.actions()
      .mouseMove(moveToElement, { x: 0, y: 0 })
      .perform();
  }

  public static querySelector(selector: string): any {
    return SkyHostBrowser.protractor.element(
      SkyHostBrowser.protractor.by.css(selector)
    ).getWebElement();
  }

  public static async setWindowDimensions(
    width: number,
    height: number
  ): Promise<void> {
    await SkyHostBrowser.protractor.browser.driver
      .manage()
      .window()
      .setSize(width, height);
  }

  public static async setWindowBreakpoint(breakpoint?: SkyHostBrowserBreakpoint): Promise<void> {
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

    await SkyHostBrowser.setWindowDimensions(width, height);
  }

  public static async scrollTo(selector: string): Promise<void> {
    const elem = SkyHostBrowser.querySelector(selector);
    await SkyHostBrowser.protractor.browser.executeScript('arguments[0].scrollIntoView();', elem);
  }
}
