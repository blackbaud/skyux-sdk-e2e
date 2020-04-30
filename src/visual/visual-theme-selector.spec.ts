import {
  cleanupTests,
  prepareTest,
  resetMock
} from './fixtures';

prepareTest();

import {
  SkyVisualThemeSelector
} from './visual-theme-selector';

describe('SkyVisualThemeSwitcher', () => {
  let mockProtractor: any;
  let mockElement: any;
  let mockSwitcherEl: any;
  let mockThemeOptionEl: any;
  let mockModeOptionEl: any;
  let mockPresenceOfPromise: Promise<any>;

  beforeEach(() => {
    mockSwitcherEl = {
      element(value: any): any {
        switch (value) {
          case 'sky-radio-group[name="theme"] input[value="modern"]':
            return mockThemeOptionEl;
          case 'sky-radio-group[name="mode"] input[value="dark"]':
            return mockModeOptionEl;
        }

        return undefined;
      }
    };

    mockModeOptionEl = undefined;

    mockThemeOptionEl = {
      click: jasmine.createSpy('click').and.callFake(() => {
        // Simulate this element only being created after the theme element has been clicked.
        mockModeOptionEl = {
          click: jasmine.createSpy('click'),
          element(): any {
            return this;
          }
        };
      }),
      element(): any {
        return this;
      }
    };

    mockElement = (value: any): any => {
      switch (value) {
        case 'sky-docs-demo-control-panel-theme':
          return mockSwitcherEl;
      }

      return undefined;
    };

    mockPresenceOfPromise = Promise.resolve();

    mockProtractor = {
      ExpectedConditions: {
        presenceOf(): Promise<any> {
          return mockPresenceOfPromise;
        }
      },
      browser: {
        wait: jasmine.createSpy('wait')
      },
      by: {
        css(selector: string): any {
          return selector;
        },
        xpath(selector: string): any {
          return selector;
        }
      },
      element: mockElement
    };
  });

  afterAll(() => {
    cleanupTests();
  });

  function applyMocks(): void {
    resetMock('protractor', mockProtractor);
  }

  it('should select the expected theme and mode', async () => {
    applyMocks();

    await SkyVisualThemeSelector.selectTheme('modern', 'dark');

    expect(mockProtractor.browser.wait).toHaveBeenCalledWith(
      mockPresenceOfPromise,
      1000
    );

    expect(mockThemeOptionEl.click).toHaveBeenCalled();
    expect(mockModeOptionEl.click).toHaveBeenCalled();
  });
});
