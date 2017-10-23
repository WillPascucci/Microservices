'use strict';

describe('Controller: CrmCtrl', function () {

  // load the controller's module
  beforeEach(module('teapotApp'));

  var CrmCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CrmCtrl = $controller('CrmCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CrmCtrl.awesomeThings.length).toBe(3);
  });
});
