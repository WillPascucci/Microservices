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
    $scope.blankPerson = {
      id: -1
    }
    $scope.currentPerson = JSON.parse(JSON.stringify($scope.blankPerson));

    $scope.pickPerson = function(person) {
      console.log($scope.currentPerson);
      $scope.currentPerson = JSON.parse(JSON.stringify(person));
      console.log($scope.currentPerson);
    }

    $scope.savePerson = function() {
      console.log($scope.currentPerson)
      if($scope.currentPerson.id == -1) {
        delete $scope.currentPerson.id
        personService.createPerson($scope, function() {
          personService.getPersons($scope);
          $scope.currentPerson = JSON.parse(JSON.stringify($scope.blankPerson));
          console.log('Success');
        }, function() {
          console.log('Failure');
        })
      }
      else {
        personService.updatePerson($scope, function() {
          personService.getPersons($scope);
          $scope.currentPerson = JSON.parse(JSON.stringify($scope.blankPerson));
          console.log('Success');
        }, function() {
          console.log('Failure');
        })
      }
      //personService.
    }

    $scope.clearPerson = function() {
      //debugger;
      $scope.currentPerson = JSON.parse(JSON.stringify($scope.blankPerson));
      //debugger;
    }

    $scope.deletePerson = function() {
      personService.deletePerson($scope, function() {
          personService.getPersons($scope);
          $scope.currentPerson = JSON.parse(JSON.stringify($scope.blankPerson));
          console.log('Success');
        }, function() {
          console.log('Failure');
        });
    }
    
  });
