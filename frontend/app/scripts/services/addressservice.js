'use strict';

/**
 * @ngdoc service
 * @name teapotApp.addressService
 * @description
 * # addressService
 * Service in the teapotApp.
 */
angular.module('teapotApp')
  .service('addressService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.baseURL = 'http://address-env.uitihrdzi7.us-east-1.elasticbeanstalk.com:8000'

    this.getAddresses = function($scope) {
        $http.get(this.baseURL + '/address/page/0')
            .then(function(response) {
                $scope.addresses = response.data
                console.log($scope.addresses)
            }, function(response) {
                console.log(response.data)
            })
    }

    this.deleteAddress = function($scope, successCallback, failureCallback) {
        $http.delete(this.baseURL+'/address/'+$scope.currentAddress.uuid)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.updateAddress = function($scope, successCallback, failureCallback) {
        $http.put(this.baseURL+'/address/'+$scope.currentAddress.uuid, $scope.currentAddress)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.createAddress = function($scope, successCallback, failureCallback) {
        $http.post(this.baseURL + '/address', $scope.currentAddress)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            })
    }
  });
