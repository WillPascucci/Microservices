'use strict';

describe('Service: etag', function () {

  // load the service's module
  beforeEach(module('teapotApp'));

  // instantiate service
  var etag;
  beforeEach(inject(function (_etag_) {
    etag = _etag_;
  }));

  it('should do something', function () {
    expect(!!etag).toBe(true);
  });

});
