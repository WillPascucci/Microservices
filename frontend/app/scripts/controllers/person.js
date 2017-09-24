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
    personService.getPersons($scope);
  });
