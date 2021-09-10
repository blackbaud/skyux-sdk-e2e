# 5.0.0-beta.1 (2021-09-10)

- Fixed the NPM release.

# 5.0.0-beta.0 (2021-09-10)

## Breaking changes

- Fixed the `SkyHostBrowser.moveCursorOffScreen` and `SkyHostBrowser.scrollTo` methods to properly handle asynchronous calls. This is a breaking change because screenshots might be slightly different when waiting for the scroll behavior to complete. [#43](https://github.com/blackbaud/skyux-sdk-e2e/pull/43)
- Dropped support for `@skyux-sdk/builder`. [#43](https://github.com/blackbaud/skyux-sdk-e2e/pull/43)

# 4.1.0 (2021-09-07)

- Added support for the e2e client theme selector. [#41](https://github.com/blackbaud/skyux-sdk-e2e/pull/41)

# 4.0.3 (2021-08-17)

- Fixed the `SkyHostBrowser` utility to resolve URLs that do not include parameters. [#40](https://github.com/blackbaud/skyux-sdk-e2e/pull/40)

# 4.0.2 (2021-05-18)

- Fixed the `SkyHostBrowser` utility to revert to `protractor.browser.baseUrl` when the SKY UX Host URL is undefined. [#39](https://github.com/blackbaud/skyux-sdk-e2e/pull/39)

# 4.0.1 (2021-01-21)

- Updated the `SkyVisual` and `SkyHostBrowser` utilities to work when `@skyux-sdk/builder` is not installed. [#37](https://github.com/blackbaud/skyux-sdk-e2e/pull/37)

# 4.0.0 (2020-05-29)

### New features

- Added support for `protractor@^7`. [#29](https://github.com/blackbaud/skyux-sdk-e2e/pull/29)

## Breaking changes

- Removed the `SkyA11y` utility. Use the [`toBeAccessible` Jasmine matcher](https://developer.blackbaud.com/skyux/learn/get-started/advanced/accessibility-unit-tests) for accessibility testing in unit tests. [#24](https://github.com/blackbaud/skyux-sdk-e2e/pull/24)
- Updated the parameters of the `toMatchBaselineScreenshot` Jasmine matcher to make them required. [#24](https://github.com/blackbaud/skyux-sdk-e2e/pull/24)

# 4.0.0-rc.2 (2020-05-28)

### New features

- Added support for `protractor@^7`. [#29](https://github.com/blackbaud/skyux-sdk-e2e/pull/29)

# 4.0.0-rc.1 (2020-05-07)

- Added bug fixes and features from the `master` branch.

# 3.2.0 (2020-04-30)

- Added `SkyVisualThemeSelector` for switching themes during a visual test run. [#27](https://github.com/blackbaud/skyux-sdk-e2e/pull/27)

# 4.0.0-rc.0 (2020-04-07)

## Breaking changes

- Removed the `SkyA11y` utility. Use the [`toBeAccessible` Jasmine matcher](https://developer.blackbaud.com/skyux/learn/get-started/advanced/accessibility-unit-tests) for accessibility testing in unit tests. [#24](https://github.com/blackbaud/skyux-sdk-e2e/pull/24)
- Updated the parameters of the `toMatchBaselineScreenshot` Jasmine matcher to make them required. [#24](https://github.com/blackbaud/skyux-sdk-e2e/pull/24)

# 3.1.2 (2019-04-04)

- Reverted breaking change dependency upgrade; downgraded `axe-webdriverjs@2.2.0` to `axe-webdriverjs@1.3.0`.

# 3.1.1 (2019-04-03)

- Fixed `SkyHostBrowser` to return correct types for its methods. [#12](https://github.com/blackbaud/skyux-sdk-e2e/pull/12)

# 3.1.0 (2019-01-14)

- Added support for `^@skyux-sdk/builder@3.0.0-rc.0`. [#11](https://github.com/blackbaud/skyux-sdk-e2e/pull/11)

# 3.0.1 (2018-11-13)

- Added console warning if `screenshotName` not set when comparing baselines. [#7](https://github.com/blackbaud/skyux-sdk-e2e/pull/7)

# 3.0.0 (2018-09-20)

- Initial major release.

# 3.0.0-alpha.1 (2018-09-11)

- Updated dependencies.

# 3.0.0-alpha.0 (2018-08-16)

- Initial release.
