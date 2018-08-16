# @skyux-sdk/e2e

[![npm](https://img.shields.io/npm/v/@skyux-sdk/e2e.svg)](https://www.npmjs.com/package/@skyux-sdk/e2e)
[![status](https://travis-ci.org/blackbaud/skyux-sdk-e2e.svg?branch=master)](https://travis-ci.org/blackbaud/skyux-sdk-e2e)

Provides Node.js helpers during SKY UX Builder E2E tests.

## Running visual tests

**my.component.e2e-spec.ts**

```
import {
  expect,
  SkyHostBrowser
} from '@skyux-sdk/e2e';

describe('Action button', () => {
  it('should match baseline screenshot', (done) => {
    SkyHostBrowser.get('action-button');
    SkyHostBrowser.setWindowBreakpoint('sm');
    expect('#screenshot-action-button').toMatchBaselineScreenshot(done, {
      screenshotName: 'action-button-sm'
    });
  });
});
```
