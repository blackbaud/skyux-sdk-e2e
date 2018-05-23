import rewiremock from 'rewiremock';

import {
  MockPixDiffFactory
} from '../visual/fixtures/mock-pix-diff-factory';

let isActive = false;

export function prepareTest(): void {
  if (isActive) {
    return;
  }

  (rewiremock('@blackbaud/skyux-logger').with({}) as any).dynamic();
  (rewiremock('pix-diff').with(MockPixDiffFactory) as any).dynamic();
  (rewiremock('protractor').with({
    browser: {}
  }) as any).dynamic();

  rewiremock.enable();

  isActive = true;
}

export function cleanupTests(): void {
  rewiremock.disable();
  isActive = false;
}

export function resetMock(name: string, value: any): void {
  rewiremock.getMock(name).with(value);
}
