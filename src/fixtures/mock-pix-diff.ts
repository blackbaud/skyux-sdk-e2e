export class MockPixDiff {
  public checkRegion() {
    return Promise.resolve({
      code: 7,
      differences: 1,
      dimension: 1
    });
  }
}
