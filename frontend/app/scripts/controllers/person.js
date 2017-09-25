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
    $scope.pageNumber = 0;
    $scope.maxPages = 0;
    personService.getPersons($scope);
    $scope.blankPerson = {
      id: -1
    }
    $scope.currentPerson = JSON.parse(JSON.stringify($scope.blankPerson));

    $scope.nextPage = function() {
      console.log('next page called')
      if($scope.pageNumber + 1 < $scope.maxPages) {
        personService.getPersonPage($scope, $scope.pageNumber + 1, function() {
          console.log('Next Page Success')
          $scope.pageNumber++;
        }, function() {
          console.log('Next Page Failure')
        })
      }
    }

    $scope.prevPage = function() {
      if($scope.pageNumber - 1 >= 0) {
        personService.getPersonPage($scope, $scope.pageNumber - 1, function() {
          console.log('Prev Page Success')
          $scope.pageNumber--;
        }, function() {
          console.log('Prev Page Failure')
        })
      }
    }

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
          $scope.currentPerson =  JSON.parse(JSON.stringify($scope.blankPerson));
          console.log('Success Create');
        }, function() {
          console.log('Failure');
        })
      }
      else {
        personService.updatePerson($scope, function() {
          personService.getPersons($scope);
          $scope.currentPerson = JSON.parse(JSON.stringify($scope.blankPerson));
          console.log('Success Update');
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
