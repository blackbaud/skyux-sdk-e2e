# SKY UX Visual

**some.spec.ts**

```
import {
  SkyVisual
} from '@blackbaud/skyux-visual';

import {
  SkyHostBrowser
} from '@blackbaud/skyux-builder/runtime/testing/e2e';

describe('', () => {
  it('should', () => {
    SkyHostBrowser.get('action-button');

    const result = SkyVisual.compareScreenshot('action-button', {
      selector: '#screenshot-action-button'
    });

    expect(result).toMatchBaseline();
  });
});
```
