'use strict';

/**
 * @ngdoc function
 * @name teapotApp.controller:PersonCtrl
 * @description
 * # PersonCtrl
 * Controller of the teapotApp
 */
angular.module('teapotApp')
  .controller('PersonCtrl', function ($scope, personService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    debugger
    $scope.persons = [
    	'Apoorv',
    	'Jiabei2',
    	'Guy',
    	'Yuval',
    	'Will'
    ];
  });
