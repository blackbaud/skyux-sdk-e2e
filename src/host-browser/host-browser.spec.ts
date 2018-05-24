// import rewiremock from 'rewiremock';

// (rewiremock('protractor').with({
//   browser: {}
// }) as any).dynamic();

// rewiremock.enable();

import {
  SkyHostBrowser
} from './host-browser';

describe('Host browser', () => {
  let mockProtractor: any;
  let mockHostUtils: any;
  let mockBrowserActions: any;
  let mockWindowActions: any;

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

    SkyHostBrowser['hostUtils'] = mockHostUtils;
    SkyHostBrowser['protractor'] = mockProtractor;
  });

  // afterEach(() => {
  //   mock.stopAll();
  // });

  it('should navigate to a URL', () => {
    spyOn(mockHostUtils, 'resolve').and.returnValue('url');
    const spy = spyOn(mockProtractor.browser, 'get').and.callThrough();

    SkyHostBrowser.get('/foo');
    expect(spy).toHaveBeenCalledWith('url', 0);
  });

  it('should navigate to a URL with a timeout', () => {
    spyOn(mockHostUtils, 'resolve').and.returnValue('url');
    const spy = spyOn(mockProtractor.browser, 'get').and.callThrough();

    SkyHostBrowser.get('/foo', 500);
    expect(spy).toHaveBeenCalledWith('url', 500);
  });

  it('should move cursor off screen', () => {
    const spy = spyOn(mockBrowserActions, 'mouseMove').and.callThrough();
    SkyHostBrowser.moveCursorOffScreen();
    expect(spy).toHaveBeenCalledWith('body', { x: 0, y: 0 });
  });

  it('should set window dimensions', () => {
    const spy = spyOn(mockWindowActions, 'setSize').and.callThrough();
    SkyHostBrowser.setWindowDimensions(5, 6);
    expect(spy).toHaveBeenCalledWith(5, 6);
  });

  it('should set window width for a breakpoint', () => {
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
    spyOn(mockProtractor, 'element').and.returnValue({
      getWebElement(): string {
        return 'element';
      }
    });

    const spy = spyOn(mockProtractor.browser, 'executeScript').and.callThrough();

    SkyHostBrowser.scrollTo('body');

    expect(spy).toHaveBeenCalledWith('arguments[0].scrollIntoView();', 'element');
  });
});
