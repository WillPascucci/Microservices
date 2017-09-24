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

    this.baseURL = 'http://address-env.uitihrdzi7.us-east-1.elasticbeanstalk.com:8000/'

    this.getAddresses = function($scope) {
        $http.get(this.baseURL + '/address')
            .then(function(response) {
                $scope.addresses = response.data
            }, function(response) {
                console.log(response.data)
            })
    }
  });
