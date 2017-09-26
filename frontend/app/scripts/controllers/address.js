'use strict';

/**
 * @ngdoc function
 * @name teapotApp.controller:AddressCtrl
 * @description
 * # AddressCtrl
 * Controller of the teapotApp
 */
angular.module('teapotApp')
  .controller('AddressCtrl', function ($scope, addressService) {
  	$scope.pageNumber = 0;
    $scope.maxPages = 0;
    addressService.getAddresses($scope);
    $scope.blankAddress = {
      uuid: -1
    }
    $scope.currentAddress = JSON.parse(JSON.stringify($scope.blankAddress));

    $scope.pickAddress = function(address) {
      console.log($scope.currentAddress);
      $scope.currentAddress = JSON.parse(JSON.stringify(address));
      console.log($scope.currentAddress);
    }

    $scope.nextPage = function() {
      console.log('next page called')
      if($scope.pageNumber + 1 < 4/*$scope.maxPages*/) {
        addressService.getAddressPage($scope, $scope.pageNumber + 1, function() {
          console.log('Next Page Success')
          $scope.pageNumber++;
        }, function() {
          console.log('Next Page Failure')
        })
      }
    }

    $scope.prevPage = function() {
      if($scope.pageNumber - 1 >= 0) {
        addressService.getAddressPage($scope, $scope.pageNumber - 1, function() {
          console.log('Prev Page Success')
          $scope.pageNumber--;
        }, function() {
          console.log('Prev Page Failure')
        })
      }
    }

    $scope.saveAddress = function() {
      console.log($scope.currentAddress)
      if($scope.currentAddress.uuid == -1) {
        delete $scope.currentAddress.uuid
        addressService.createAddress($scope, function() {
          addressService.getAddresses($scope);
          $scope.currentAddress = JSON.parse(JSON.stringify($scope.blankAddress));
          console.log('Success');
        }, function() {
          console.log('Failure');
        })
      }
      else {
        addressService.updateAddress($scope, function() {
          addressService.getAddresses($scope);
          $scope.currentAddress = JSON.parse(JSON.stringify($scope.blankAddress));
          console.log('Success');
        }, function() {
          console.log('Failure');
        })
      }
      //addressService.
    }

    $scope.clearAddress = function() {
      //debugger;
      $scope.currentAddress = JSON.parse(JSON.stringify($scope.blankAddress));
      //debugger;
    }

    $scope.deleteAddress = function() {
      addressService.deleteAddress($scope, function() {
          addressService.getAddresses($scope);
          $scope.currentAddress = JSON.parse(JSON.stringify($scope.blankAddress));
          console.log('Success');
        }, function() {
          console.log('Failure');
        });
    }
  });
