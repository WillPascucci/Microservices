'use strict';

/**
 * @ngdoc service
 * @name teapotApp.companyService
 * @description
 * # companyService
 * Service in the teapotApp.
 */
angular.module('teapotApp')
  .service('companyService', function ($http) {
  	this.baseURL = 'https://0j1j9o13l2.execute-api.us-east-1.amazonaws.com/prod/companyFunc'
    this.getCompanys = function($scope) {
        $http.get(this.baseURL + '/company/pfax/'+$scope.pfaxNumber)
            .then(function(response) {
                $scope.Companys = response.data
                $scope.maxPfaxs = response.data[0].totalPfaxs
                console.log($scope.Companys)
            }, function(response) {
                console.log(response.data)
            })
    }

    this.getCompanyPfax = function($scope, pfaxRequested, successCallback, failureCallback) {
        $http.get(this.baseURL + '/company/pfax/'+pfaxRequested)
            .then(function(response) {
                console.log(response.data)
                $scope.Companys = response.data
                successCallback()
            }, function(response) {
                console.log(response.data)
                failureCallback()
            });
    }

    this.deleteCompany = function($scope, successCallback, failureCallback) {
        $http.delete(this.baseURL+'/company/'+$scope.currentCompany.id)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.updateCompany = function($scope, successCallback, failureCallback) {
        console.log($scope.currentCompany)
        $http.put(this.baseURL+'/company/'+$scope.currentCompany.id, $scope.currentCompany)
            .then(function(response) {
                console.log(response)
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.createCompany = function($scope, successCallback, failureCallback) {
        $http.post(this.baseURL + '/company', $scope.currentCompany)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            })
    }

    this.findCompany = function($scope, successCallback, failureCallback) {
        var queryString = '?'
        if($scope.currentCompany.name) {
            queryString += 'name=' + $scope.currentCompany.name + '&'
        }
        if($scope.currentCompany.type) {
            queryString += 'type=' + $scope.currentCompany.type + '&'
        }
        if($scope.currentCompany.fax) {
            queryString += 'fax=' + $scope.currentCompany.fax + '&'
        }
		if($scope.currentCompany.contact) {
            queryString += 'contact=' + $scope.currentCompany.contact + '&'
        }
        if($scope.currentCompany.phone) {
            queryString += 'phone=' + $scope.currentCompany.phone + '&'
        }
        console.log(queryString)
        //console.log(this.baseURL + '/person' + queryString)
        $http.get(this.baseURL + '/company' + queryString)
            .then(function(response) {
                //console.log(response.data)
                successCallback(response.data)
            }, function(response) {
                failureCallback()
            });
    }
  });
