'use strict';

describe('Service: teauuid', function () {

  // load the service's module
  beforeEach(module('teapotApp'));

  // instantiate service
  var teauuid;
  beforeEach(inject(function (_teauuid_) {
    teauuid = _teauuid_;
  }));

  it('should do something', function () {
    expect(!!teauuid).toBe(true);
  });

});
