Error.stackTraceLimit = Infinity;

const testContext = require.context('../../src', true, /\.spec\.ts/);

function requireAll(requireContext) {
  requireContext.keys().map(requireContext);
}

requireAll(testContext);
