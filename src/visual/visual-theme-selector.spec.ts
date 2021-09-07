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
  const e2eSelectorCss = '.sky-e2e-theme-selector';

  let mockProtractor: any;
  let mockElement: any;
  let mockSwitcherEl: any;
  let mockThemeOptionEl: any;
  let mockModeOptionEl: any;
  let mockPresenceOfPromise: Promise<any>;
  let mockE2eOptionEls: {
    default: any,
    'modern-dark': any,
    'modern-light': any
  };

  beforeEach(() => {
    mockE2eOptionEls = {
      default: {
        click: jasmine.createSpy()
      },
      'modern-dark':  {
        click: jasmine.createSpy()
      },
      'modern-light':  {
        click: jasmine.createSpy()
      }
    };

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
        case '.sky-e2e-theme-selector option[value="default"]':
          return mockE2eOptionEls.default;
        case '.sky-e2e-theme-selector option[value="modern-dark"]':
          return mockE2eOptionEls['modern-dark'];
        case '.sky-e2e-theme-selector option[value="modern-light"]':
          return mockE2eOptionEls['modern-light'];
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
        wait: jasmine.createSpy('wait'),
        isElementPresent: jasmine.createSpy('isElementPresent')
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

  describe('with e2e theme selector', () => {
    async function validateTheme(theme: string, mode?: string): Promise<void> {
      await SkyVisualThemeSelector.selectTheme(theme, mode);

      let themeName = theme;

      if (mode) {
        themeName += `-${mode}`;
      }

      expect((mockE2eOptionEls as any)[themeName].click).toHaveBeenCalled();
    }

    beforeEach(() => {
      mockProtractor.browser.isElementPresent.and.callFake((selector: string) => {
        return selector === e2eSelectorCss;
      });

      applyMocks();
    });

    it('should select the expected theme and mode', async () => {
      applyMocks();

      await validateTheme('default');
      await validateTheme('modern', 'light');
      await validateTheme('modern', 'dark');
    });
  });

  describe('with docs theme selector', () => {
    beforeEach(() => {
      mockProtractor.browser.isElementPresent.and.callFake((selector: string) => {
        return selector !== e2eSelectorCss;
      });

      applyMocks();
    });

    it('should select the expected theme and mode', async () => {
      await SkyVisualThemeSelector.selectTheme('modern', 'dark');

      expect(mockProtractor.browser.wait).toHaveBeenCalledWith(
        mockPresenceOfPromise,
        1000
      );

      expect(mockThemeOptionEl.click).toHaveBeenCalled();
      expect(mockModeOptionEl.click).toHaveBeenCalled();
    });
  });
});
