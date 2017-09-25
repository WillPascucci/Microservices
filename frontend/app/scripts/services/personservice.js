'use strict';

/**
 * @ngdoc service
 * @name teapotApp.personService
 * @description
 * # personService
 * Service in the teapotApp.
 */
angular.module('teapotApp')
  .service('personService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.baseURL = 'http://person-env.n924wyqpyp.us-east-1.elasticbeanstalk.com:8000'

    this.getPersons = function($scope) {
        $http.get(this.baseURL + '/person')
            .then(function(response) {
                $scope.persons = response.data
                console.log($scope.persons)
            }, function(response) {
                console.log(response.data)
            })
    }

    this.deletePerson = function($scope, successCallback, failureCallback) {
        $http.delete(this.baseURL+'/person/'+$scope.currentPerson.id)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.updatePerson = function($scope, successCallback, failureCallback) {
        $http.put(this.baseURL+'/person', $scope.currentPerson)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.createPerson = function($scope, successCallback, failureCallback) {
        $http.post(this.baseURL + '/person', $scope.currentPerson)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            })
    }


    /*
    this.getPerson = function(personID) {
    	return $http.get(this.baseURL+'/person/'+personID);
    }

    this.createPerson = function(person) {
    	return $http.post(this.baseURL+'/person');
    }

    this.changePerson = function(person) {
    	return $http.post(this.baseURL + '/person/'+person.personID);
    }

    this.getPersonPage = function(pagenum) {
    	return $http.get(this.baseURL +'/person', {
    		pageNum: pagenum
    	});
    }
    */
  });
