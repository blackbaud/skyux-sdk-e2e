import mock from 'mock-require';

import {
  SkyHostBrowser
} from './host-browser';

describe('Host browser', () => {
  let mockProtractor: any;
  let mockHostUtils: any;
  let mockBrowserActions: any;
  let mockWindowActions: any;
  let browserGetSpy: jasmine.Spy;

  beforeEach(() => {
    mockBrowserActions = {
      mouseMove(): any {
        return {
          perform(): void {}
        };
      }
    };

    mockWindowActions = {
      setSize(): any {}
    };

    mockProtractor = {
      browser: {
        driver: {
          manage(): any {
            return {
              window(): any {
                return mockWindowActions;
              }
            };
          }
        },
        actions(): any {
          return mockBrowserActions;
        },
        executeScript(): any {},
        get(): any {},
        params: {}
      },
      by: {
        css: (selector: string) => selector
      },
      element(value: any): any {
        return {
          getWebElement(): any {
            return value;
          }
        };
      }
    };

    mockHostUtils = {
      resolve(): any {}
    };

    browserGetSpy = spyOn(mockProtractor.browser, 'get');
  });

  afterEach(() => {
    mock.stopAll();
  });

  function setupTest(): void {
    SkyHostBrowser['protractor'] = mockProtractor;
    mock('@skyux-sdk/builder/utils/host-utils', mockHostUtils);
  }

  it('should navigate to a URL', () => {
    setupTest();
    spyOn(mockHostUtils, 'resolve').and.returnValue('url');
    SkyHostBrowser.get('/foo');
    expect(browserGetSpy).toHaveBeenCalledWith('url', 0);
  });

  it('should navigate to a URL with a timeout', () => {
    setupTest();
    spyOn(mockHostUtils, 'resolve').and.returnValue('url');
    SkyHostBrowser.get('/foo', 500);
    expect(browserGetSpy).toHaveBeenCalledWith('url', 500);
  });

  it('should move cursor off screen', () => {
    setupTest();
    const spy = spyOn(mockBrowserActions, 'mouseMove').and.callThrough();
    SkyHostBrowser.moveCursorOffScreen();
    expect(spy).toHaveBeenCalledWith('body', { x: 0, y: 0 });
  });

  it('should set window dimensions', () => {
    setupTest();
    const spy = spyOn(mockWindowActions, 'setSize').and.callThrough();
    SkyHostBrowser.setWindowDimensions(5, 6);
    expect(spy).toHaveBeenCalledWith(5, 6);
  });

  it('should set window width for a breakpoint', () => {
    setupTest();
    const spy = spyOn(mockWindowActions, 'setSize').and.callThrough();

    SkyHostBrowser.setWindowBreakpoint('xs');
    expect(spy).toHaveBeenCalledWith(480, 800);
    spy.calls.reset();

    SkyHostBrowser.setWindowBreakpoint('sm');
    expect(spy).toHaveBeenCalledWith(768, 800);
    spy.calls.reset();

    SkyHostBrowser.setWindowBreakpoint('md');
    expect(spy).toHaveBeenCalledWith(992, 800);
    spy.calls.reset();

    SkyHostBrowser.setWindowBreakpoint('lg');
    expect(spy).toHaveBeenCalledWith(1200, 800);
    spy.calls.reset();

    SkyHostBrowser.setWindowBreakpoint();
    expect(spy).toHaveBeenCalledWith(1200, 800);
    spy.calls.reset();
  });

  it('should scroll to element', () => {
    setupTest();

    spyOn(mockProtractor, 'element').and.returnValue({
      getWebElement(): string {
        return 'element';
      }
    });

    const spy = spyOn(mockProtractor.browser, 'executeScript').and.callThrough();

    SkyHostBrowser.scrollTo('body');

    expect(spy).toHaveBeenCalledWith('arguments[0].scrollIntoView();', 'element');
  });

  async function verifyHostUrl(relativePath: string, expectedUrl: string): Promise<void> {
    await SkyHostBrowser.get(relativePath);
    expect(browserGetSpy).toHaveBeenCalledWith(expectedUrl, 0);
    browserGetSpy.calls.reset();
  }

  it('should resolve Host URL if `@skyux-sdk/builder` is not installed', async () => {
    mockHostUtils = undefined;

    setupTest();

    // Setup Protractor `params`.
    mockProtractor.browser.params = {
      skyuxHostUrl: 'https://app.blackbaud.com/?local=true&_cfg=abcdefg'
    };

    await verifyHostUrl('/foo', 'https://app.blackbaud.com/foo?local=true&_cfg=abcdefg');
    await verifyHostUrl('foo', 'https://app.blackbaud.com/foo?local=true&_cfg=abcdefg');
    await verifyHostUrl('/foo?leid=foobar', 'https://app.blackbaud.com/foo?leid=foobar&local=true&_cfg=abcdefg');
  });

  it('should default to base URL if browser params unset', async () => {
    mockHostUtils = undefined;
    mockProtractor.browser.baseUrl = 'https://localhost:4200/';

    setupTest();

    await verifyHostUrl('/foo', 'https://localhost:4200/foo');
    await verifyHostUrl('foo', 'https://localhost:4200/foo');
    await verifyHostUrl('/foo?leid=foobar', 'https://localhost:4200/foo?leid=foobar');
  });

});
