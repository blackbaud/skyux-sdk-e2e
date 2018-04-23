import { MockPixDiff } from './mock-pix-diff';

export class MockPixDiffFactory {
  public static THRESHOLD_PERCENT = 'percent';
  public static RESULT_SIMILAR = 5;
  public static RESULT_IDENTICAL = 7;
  public static instance: MockPixDiff;

  constructor() {
    return MockPixDiffFactory.instance;
  }
}
