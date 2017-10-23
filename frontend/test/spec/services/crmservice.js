'use strict';

describe('Service: CRMservice', function () {

  // load the service's module
  beforeEach(module('teapotApp'));

  // instantiate service
  var CRMservice;
  beforeEach(inject(function (_CRMservice_) {
    CRMservice = _CRMservice_;
  }));

  it('should do something', function () {
    expect(!!CRMservice).toBe(true);
  });

});
