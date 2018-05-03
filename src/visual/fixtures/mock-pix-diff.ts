export class MockPixDiff {
  public checkRegion(): Promise<any> {
    return Promise.resolve({
      code: 7,
      differences: 1,
      dimension: 1
    });
  }
}
