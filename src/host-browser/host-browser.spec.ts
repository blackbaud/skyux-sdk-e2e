import mock from 'mock-require';

import {
  SkyHostBrowser
} from './host-browser';

describe('Host browser', () => {
  let mockProtractor: any;
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
            return Promise.resolve(value);
          }
        };
      }
    };

    browserGetSpy = spyOn(mockProtractor.browser, 'get');
  });

  afterEach(() => {
    mock.stopAll();
  });

  function setupTest(): void {
    SkyHostBrowser['protractor'] = mockProtractor;
  }

  it('should navigate to a URL', () => {
    setupTest();
    mockProtractor.browser.baseUrl = 'https://app.blackbaud.com/';
    SkyHostBrowser.get('/foo');
    expect(browserGetSpy).toHaveBeenCalledWith('https://app.blackbaud.com/foo', 0);
  });

  it('should navigate to a URL with a timeout', () => {
    setupTest();
    mockProtractor.browser.baseUrl = 'https://app.blackbaud.com/';
    SkyHostBrowser.get('/foo', 500);
    expect(browserGetSpy).toHaveBeenCalledWith('https://app.blackbaud.com/foo', 500);
  });

  it('should move cursor off screen', async () => {
    setupTest();
    const spy = spyOn(mockBrowserActions, 'mouseMove').and.callThrough();
    await SkyHostBrowser.moveCursorOffScreen();
    expect(spy).toHaveBeenCalledWith('body', { x: 0, y: 0 });
  });

  it('should set window dimensions', async () => {
    setupTest();
    const spy = spyOn(mockWindowActions, 'setSize').and.callThrough();
    await SkyHostBrowser.setWindowDimensions(5, 6);
    expect(spy).toHaveBeenCalledWith(5, 6);
  });

  it('should set window width for a breakpoint', async () => {
    setupTest();
    const spy = spyOn(mockWindowActions, 'setSize').and.callThrough();

    await SkyHostBrowser.setWindowBreakpoint('xs');
    expect(spy).toHaveBeenCalledWith(480, 800);
    spy.calls.reset();

    await SkyHostBrowser.setWindowBreakpoint('sm');
    expect(spy).toHaveBeenCalledWith(768, 800);
    spy.calls.reset();

    await SkyHostBrowser.setWindowBreakpoint('md');
    expect(spy).toHaveBeenCalledWith(992, 800);
    spy.calls.reset();

    await SkyHostBrowser.setWindowBreakpoint('lg');
    expect(spy).toHaveBeenCalledWith(1200, 800);
    spy.calls.reset();

    await SkyHostBrowser.setWindowBreakpoint();
    expect(spy).toHaveBeenCalledWith(1200, 800);
    spy.calls.reset();
  });

  it('should scroll to element', async () => {
    setupTest();

    spyOn(mockProtractor, 'element').and.returnValue({
      getWebElement(): Promise<string> {
        return Promise.resolve('element');
      }
    });

    const spy = spyOn(mockProtractor.browser, 'executeScript').and.callThrough();

    await SkyHostBrowser.scrollTo('body');

    expect(spy).toHaveBeenCalledWith('arguments[0].scrollIntoView();', 'element');
  });

  async function verifyHostUrl(relativePath: string, expectedUrl: string): Promise<void> {
    await SkyHostBrowser.get(relativePath);
    expect(browserGetSpy).toHaveBeenCalledWith(expectedUrl, 0);
    browserGetSpy.calls.reset();
  }

  it('should default to base URL if browser params unset', async () => {
    mockProtractor.browser.baseUrl = 'https://localhost:4200/';

    setupTest();

    await verifyHostUrl('/foo', 'https://localhost:4200/foo');
    await verifyHostUrl('foo', 'https://localhost:4200/foo');
    await verifyHostUrl('/foo?leid=foobar', 'https://localhost:4200/foo?leid=foobar');
  });

  it('should handle baseUrl with params', async () => {
    mockProtractor.browser.baseUrl = 'https://localhost:4200/?foo=bar';

    setupTest();

    await verifyHostUrl('/foo', 'https://localhost:4200/foo?foo=bar');
    await verifyHostUrl('foo', 'https://localhost:4200/foo?foo=bar');
    await verifyHostUrl('/foo?leid=foobar', 'https://localhost:4200/foo?leid=foobar&foo=bar');
  });

});
