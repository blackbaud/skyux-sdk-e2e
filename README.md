# SKY UX Library - E2E

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
    expect('#screenshot-action-button').toMatchBaselineScreenshot(done, {
      breakpoint: 'sm'
    });
  });
});
```
