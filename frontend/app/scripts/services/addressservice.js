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
    this.smartyStreetsURL = 'https://us-street.api.smartystreets.com/street-address'
    this.smartyAuthId = '72315ecb-e04b-4417-200a-bfcb2ac9df63'
    this.smartyAuthToken = 'J3njx4aHnVdnf6k7l4yR'

    this.getAddresses = function($scope) {
        $http.get(this.baseURL + '/address/page/'+$scope.pageNumber)
            .then(function(response) {
                $scope.addresses = response.data
                $scope.maxPages = response.data[0].totalPages
                console.log($scope.addresses)
            }, function(response) {
                console.log(response.data)
            })
    }

    this.getAddressPage = function($scope, pageRequested, successCallback, failureCallback) {
        $http.get(this.baseURL + '/address/page/'+pageRequested)
            .then(function(response) {
                console.log(response.data)
                $scope.addresses = response.data
                $scope.maxPages = response.data[0].totalPages
                successCallback()
            }, function(response) {
                console.log(response.data)
                failureCallback()
            });
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

    this.checkAddress = function($scope, successCallback, failureCallback) {
        //Gray out submit button until Checked and Found
        var smartyURL = this.smartyStreetsURL
        var smartyQueryString = '?auth-id=' + this.smartyAuthId + '&auth-token=' + this.smartyAuthToken
        //console.log($scope.currentAddress)
        if($scope.currentAddress.zipcode) {
            smartyQueryString += '&zipcode=' + encodeURI($scope.currentAddress.zipcode)
        }
        if($scope.currentAddress.city) {
            smartyQueryString += '&city=' + encodeURI($scope.currentAddress.city)
        }
        if($scope.currentAddress.street) {
            smartyQueryString += '&street=' + encodeURI($scope.currentAddress.street)
        }
        if($scope.currentAddress.state) {
            smartyQueryString += '&state=' + encodeURI($scope.currentAddress.state)
        }
        //console.log(smartyURL+smartyQueryString)
        
        $http.get(smartyURL+smartyQueryString)
            .then(function(response) {
                console.log(response)
                successCallback(response.data)
                //console.log(response)
            }, function(response) {
                failureCallback()
                console.log(response)
            })
    }
  });
