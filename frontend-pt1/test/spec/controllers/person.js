'use strict';

describe('Controller: PersonCtrl', function () {

  // load the controller's module
  beforeEach(module('teapotApp'));

  var PersonCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PersonCtrl = $controller('PersonCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PersonCtrl.awesomeThings.length).toBe(3);
  });
});
