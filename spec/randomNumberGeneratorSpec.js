'use strict';

describe('RandomNumberGenerator', function () {

  describe('#randomNumber', function() {
    it('returns a random number larger than the min value', function() {
      expect(randomNumberGenerator(3,7)).toBeGreaterThan(2);
    });
    it('returns a random number smaller than the max value', function() {
      expect(randomNumberGenerator(3,7)).toBeLessThan(7);
    });
  });
});
