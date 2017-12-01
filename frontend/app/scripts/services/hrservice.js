'use strict';

/**
 * @ngdoc service
 * @name teapotApp.HRservice
 * @description
 * # HRservice
 * Service in the teapotApp.
 */
angular.module('teapotApp')
  .service('HRService', function ($http) {
	//this.baseURL = 'http://HR-env.n924wyqpyp.us-east-1.elasticbeanstalk.com:8000'
    this.baseURL = 'https://0j1j9o13l2.execute-api.us-east-1.amazonaws.com/prod'

    this.getHRs = function($scope) {
        $http.get(this.baseURL + '/employeeFunc2/page/'+$scope.pageNumber)
            .then(function(response) {
                $scope.HRs = response.data
                $scope.maxPages = response.data[0].totalPages
                console.log($scope.HRs)
            }, function(response) {
                console.log(response.data)
            })
    }

    this.getHRPage = function($scope, pageRequested, successCallback, failureCallback) {
        $http.get(this.baseURL + '/employeeFunc2/page/'+pageRequested)
            .then(function(response) {
                console.log(response.data)
                $scope.HRs = response.data
                successCallback()
            }, function(response) {
                console.log(response.data)
                failureCallback()
            });
    }

    this.deleteHR = function($scope, successCallback, failureCallback) {
        $http.delete(this.baseURL+'/employeeFunc2/'+$scope.currentHR.id)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.updateHR = function($scope, successCallback, failureCallback) {
        console.log($scope.currentHR)
        $http.put(this.baseURL+'/employeeFunc2/'+$scope.currentHR.id, $scope.currentHR)
            .then(function(response) {
                console.log(response)
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.createHR = function($scope, successCallback, failureCallback) {
        $http.post(this.baseURL + '/employeeFunc2', $scope.currentHR)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            })
    }
  });
