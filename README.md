# SKY UX Library - E2E

**some.e2e-spec.ts**

```
import {
  expect
} from '@blackbaud/skyux-lib-e2e';

import {
  SkyHostBrowser
} from '@blackbaud/skyux-builder/runtime/testing/e2e';

describe('', () => {
  it('should', () => {
    SkyHostBrowser.get('action-button');
    expect('#screenshot-action-button').toMatchBaseline({
      breakpoint: 'sm'
    });
  });
});
```
