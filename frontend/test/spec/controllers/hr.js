'use strict';

describe('Controller: HrCtrl', function () {

  // load the controller's module
  beforeEach(module('teapotApp'));

  var HrCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HrCtrl = $controller('HrCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HrCtrl.awesomeThings.length).toBe(3);
  });
});
