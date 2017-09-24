'use strict';

/**
 * @ngdoc function
 * @name teapotApp.controller:AddressCtrl
 * @description
 * # AddressCtrl
 * Controller of the teapotApp
 */
angular.module('teapotApp')
  .controller('AddressCtrl', function ($scope, addressService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.one = 1;
    addressService($scope);
  });
