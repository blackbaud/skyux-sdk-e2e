import {
  Ptor
} from 'protractor';

import {
  SkyHostBrowserBreakpoint
} from './host-browser-breakpoint';

export abstract class SkyHostBrowser {

  /**
   * Add backward compatibility with `@skyux-sdk/builder@^4`.
   */
  private static get hostUtils(): {
    resolve: (...args: any[]) => string;
  } {
    try {
      return require('@skyux-sdk/builder/utils/host-utils');
    } catch (err) { }
  };

  private static protractor: Ptor = require('protractor');

  public static async get(
    url: string,
    timeout = 0
  ): Promise<any> {
    const params = SkyHostBrowser.protractor.browser.params;

    const destination = (this.hostUtils)
      ? SkyHostBrowser.hostUtils.resolve(
        url,
        params.localUrl,
        params.chunks,
        params.skyPagesConfig
      )
      // If hostUtils cannot be imported, attempt to use the Host URL defined on the params object
      // (this value, if it exists, will have been set by one of SKY UX's build tools).
      // If all else fails, default to Protractor's base URL.
      : SkyHostBrowser.resolveHostUrl(
        params.skyuxHostUrl || SkyHostBrowser.protractor.browser.baseUrl,
        url
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

  private static resolveHostUrl(hostUrl: string, pathname: string): string {
    // Remove first forward slash, if it exists.
    pathname = (pathname.indexOf('/') === 0)
      ? pathname.substr(1)
      : pathname;

    if (hostUrl.indexOf('?') === -1) {
      return hostUrl + pathname;
    }

    return (pathname.indexOf('?') > -1)
      ? hostUrl.replace('?', `${pathname}&`)
      : hostUrl.replace('?', `${pathname}?`);
  }
}
