export const MockPixDiffFactory: any = function(config: any) {
  MockPixDiffFactory.config = config;
  return MockPixDiffFactory.instance;
};

MockPixDiffFactory.THRESHOLD_PERCENT = 'percent';
MockPixDiffFactory.RESULT_SIMILAR = 5;
MockPixDiffFactory.RESULT_IDENTICAL = 7;
MockPixDiffFactory.instance = {};
