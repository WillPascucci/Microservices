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
    $scope.alertTypes = ['alert alert-success', 'alert alert-info', 'alert alert-warning', 'alert alert-danger']
    $scope.checkAddressMessage = 'Please check your address before saving'
    $scope.addressFoundMessage = 'Address Exists!'
    $scope.addressNotFoundMessage = 'Address does not exist :('

  	$scope.pageNumber = 0;
    $scope.maxPages = 0;
    addressService.getAddresses($scope);
    $scope.blankAddress = {
      uuid: -1
    }
    $scope.currentAddress = JSON.parse(JSON.stringify($scope.blankAddress));
    
    $scope.addressChecked = false;
    $scope.addressFound = false;
    $scope.alertType = ''
    $scope.alertMessage = ''

    $scope.addressTextChanged = function() {
      $scope.addressChecked = false;
      $scope.addressFound = false;
      $scope.updateAlert()
    }

    $scope.updateAlert = function() {
      if($scope.addressChecked && $scope.addressFound) {
        $scope.alertType = $scope.alertTypes[0]
        $scope.alertMessage = $scope.addressFoundMessage
      } else if($scope.addressChecked && !$scope.addressFound) {
        $scope.alertType = $scope.alertTypes[3]
        $scope.alertMessage = $scope.addressNotFoundMessage
      } else {
        $scope.alertType = $scope.alertTypes[2]
        $scope.alertMessage = $scope.checkAddressMessage
      }
    }

    $scope.pickAddress = function(address) {
      console.log($scope.currentAddress);
      $scope.currentAddress = JSON.parse(JSON.stringify(address));
      console.log($scope.currentAddress);
    }

    $scope.nextPage = function() {
      console.log('next page called')
      if($scope.pageNumber + 1 < $scope.maxPages) {
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
          //$scope.currentAddress = JSON.parse(JSON.stringify($scope.blankAddress));
          $scope.clearAddress();
          //  $scope.alertMessage = ''
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
      $scope.addressChecked = false;
      $scope.addressFound = false;
      $scope.alertType = ''
      $scope.alertMessage = ''
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

    $scope.checkAddress = function() {
      addressService.checkAddress($scope, function(data) {
        //console.log(data[0].components)
        //console.log('called')
        if(data.length >= 1) {
            $scope.currentAddress.street = data[0].components.primary_number + ' '
            if('street_predirection' in data[0].components) {
              $scope.currentAddress.street += data[0].components.street_predirection + ' '
            }
            $scope.currentAddress.street += data[0].components.street_name + ' ' + data[0].components.street_suffix;
            $scope.currentAddress.city = data[0].components.city_name;
            $scope.currentAddress.state = data[0].components.state_abbreviation;
            $scope.currentAddress.zipcode = data[0].components.zipcode;

            $scope.addressChecked = true;
            $scope.addressFound = true;
            $scope.updateAlert()
            console.log('found')
            console.log($scope.addressFound)
        } else {
            $scope.addressChecked = true;
            $scope.addressFound = false;
            $scope.updateAlert()
        }
      }, function() {
        console.log('Failure')
      })
    }
  });
