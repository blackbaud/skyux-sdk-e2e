// tslint:disable-next-line
/// <reference path="./matchers-declaration.ts"/>

// Apply matchers to global.
// (The reference above is required since TypeScript doesn't know how to handle this file.)
(function() {
  const SkyVisualMatchers: jasmine.CustomMatcherFactories = {
    toMatchBaseline: (
      util: jasmine.MatchersUtil,
      customEqualityTesters: jasmine.CustomEqualityTester[]
    ) => {
      return {
        compare(actual: any): jasmine.CustomMatcherResult {
          return {
            message: actual.message,
            pass: actual.isSimilar
          };
        }
      };
    }
  };

  const globalRef: any = global;
  if (globalRef.beforeEach) {
    globalRef.beforeEach(() => {
      globalRef.jasmine.addMatchers(SkyVisualMatchers);
    });
  }
}());
