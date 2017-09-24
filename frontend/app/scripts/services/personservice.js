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

    this.baseURL = 'http://test-env.wgvvepxg5d.us-east-1.elasticbeanstalk.com'

    this.getAllPersons = function() {
    	return $http.get(this.baseURL+'/person');
    }

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
  });
