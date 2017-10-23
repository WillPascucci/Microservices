'use strict';

describe('Service: HRservice', function () {

  // load the service's module
  beforeEach(module('teapotApp'));

  // instantiate service
  var HRservice;
  beforeEach(inject(function (_HRservice_) {
    HRservice = _HRservice_;
  }));

  it('should do something', function () {
    expect(!!HRservice).toBe(true);
  });

});
