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
    this.baseURL = 'http://CRM-env.uitihrdzi7.us-east-1.elasticbeanstalk.com:8000'

    this.getCRMs = function($scope) {
        $http.get(this.baseURL + '/CRM/page/'+$scope.pageNumber)
            .then(function(response) {
                $scope.CRMes = response.data
                $scope.maxPages = response.data[0].totalPages
                console.log($scope.CRMes)
            }, function(response) {
                console.log(response.data)
            })
    }

    this.getCRMPage = function($scope, pageRequested, successCallback, failureCallback) {
        $http.get(this.baseURL + '/CRM/page/'+pageRequested)
            .then(function(response) {
                console.log(response.data)
                $scope.CRMes = response.data
                $scope.maxPages = response.data[0].totalPages
                successCallback()
            }, function(response) {
                console.log(response.data)
                failureCallback()
            });
    }

    this.deleteCRM = function($scope, successCallback, failureCallback) {
        $http.delete(this.baseURL+'/CRM/'+$scope.currentCRM.uuid)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.updateCRM = function($scope, successCallback, failureCallback) {
        $http.put(this.baseURL+'/CRM/'+$scope.currentCRM.uuid, $scope.currentCRM)
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
