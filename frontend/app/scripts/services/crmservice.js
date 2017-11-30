'use strict';

/**
 * @ngdoc service
 * @name teapotApp.CRMservice
 * @description
 * # CRMservice
 * Service in the teapotApp.
 */
angular.module('teapotApp')
  .service('CRMService', function ($http) {
    this.baseURL = 'https://0j1j9o13l2.execute-api.us-east-1.amazonaws.com/prod'

    this.getCRMs = function($scope) {
        $http.get(this.baseURL + '/customerFunc2/page/'+$scope.pageNumber)
            .then(function(response) {
                $scope.CRMs = response.data
                $scope.maxPages = response.data[0].totalPages
                console.log($scope.CRMs)
            }, function(response) {
                console.log(response.data)
            })
    }

    this.getCRMPage = function($scope, pageRequested, successCallback, failureCallback) {
        $http.get(this.baseURL + '/customerFunc2/page/'+pageRequested)
            .then(function(response) {
                console.log(response.data)
                $scope.CRMs = response.data
                $scope.maxPages = response.data[0].totalPages
                successCallback()
            }, function(response) {
                console.log(response.data)
                failureCallback()
            });
    }

    this.deleteCRM = function($scope, successCallback, failureCallback) {
        $http.delete(this.baseURL+'/customerFunc2/'+$scope.currentCRM.uuid)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.updateCRM = function($scope, successCallback, failureCallback) {
        $http.put(this.baseURL+'/customerFunc2/'+$scope.currentCRM.uuid, $scope.currentCRM)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.createCRM = function($scope, successCallback, failureCallback) {
        $http.post(this.baseURL + '/CRM', $scope.currentCRM)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            })
    }
  });
