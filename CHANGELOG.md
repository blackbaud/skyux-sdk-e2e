# 4.0.0-rc.1 (2020-05-07)

- Added bug fixes and features from the `master` branch.

# 3.2.0 (2020-04-30)

- Added `SkyVisualThemeSelector` for switching themes during a visual test run. [#27](https://github.com/blackbaud/skyux-sdk-e2e/pull/27)

# 4.0.0-rc.0 (2020-04-07)

## Breaking changes

- Removed the `SkyA11y` utility. Accessibility testing should be done within unit tests using the [`toBeAccessible` Jasmine matcher](https://developer.blackbaud.com/skyux/learn/get-started/advanced/accessibility-unit-tests). [#24](https://github.com/blackbaud/skyux-sdk-e2e/pull/24)
- Made all parameters of the `toMatchBaselineScreenshot` Jasmine matcher required. [#24](https://github.com/blackbaud/skyux-sdk-e2e/pull/24)

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
