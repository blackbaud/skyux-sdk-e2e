import rewiremock from 'rewiremock';
import { MockPixDiff } from './fixtures/mock-pix-diff';
import { MockPixDiffFactory } from './fixtures/mock-pix-diff-factory';

const mockPixDiff = new MockPixDiff();
MockPixDiffFactory.instance = mockPixDiff;

rewiremock.enable();
(rewiremock('protractor').with({}) as any).dynamic();
rewiremock('pix-diff').with(MockPixDiffFactory);

import { SkyVisual } from './visual';

describe('SkyVisual', () => {
  beforeEach(() => {
    rewiremock.getMock('protractor').with({
      browser: {
        skyVisualTestConfig: {
          foo: 'bar'
        }
      },
      by: {
        css(selector: string) {
          return selector;
        }
      },
      element(value: any) {
        return value;
      }
    });
  });

  afterAll(() => {
    rewiremock.disable();
  });

  it('should compare exact screenshots', (done) => {
    SkyVisual.compareScreenshot('foo').then((result: any) => {
      expect(result.isSimilar).toEqual(true);
      expect(result.message).toEqual('Screenshots for "foo" have mismatch of 100.00 percent!');
      done();
    });
  });
});
