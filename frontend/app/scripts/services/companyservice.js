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
  	this.baseURL = 'https://0j1j9o13l2.execute-api.us-east-1.amazonaws.com/prod'
    
    this.getCompanys = function($scope) {
        $http.get(this.baseURL + '/companyFunc/page/'+$scope.companyPageNumber)
            .then(function(response) {
                $scope.companys = response.data
                $scope.companyMaxPages = response.data[0].totalPages
                console.log($scope.companys)
            }, function(response) {
                console.log(response.data)
            })
    }

    this.getCompanyPage = function($scope, pageRequested, successCallback, failureCallback) {
        console.log('Company page called')
        $http.get(this.baseURL + '/companyFunc/page/'+pageRequested)
            .then(function(response) {
                console.log('company')
                console.log(response)
                console.log(response.data)
                $scope.companys = response.data
                successCallback()
            }, function(response) {
                console.log(response.data)
                failureCallback()
            });
    }

    this.deleteCompany = function($scope, successCallback, failureCallback) {
        $http.delete(this.baseURL+'/companyFunc/'+$scope.currentCompany.id)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.updateCompany = function($scope, successCallback, failureCallback) {
        console.log($scope.currentCompany)
        $http.put(this.baseURL+'/companyFunc/'+$scope.currentCompany.id, $scope.currentCompany)
            .then(function(response) {
                console.log(response)
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.createCompany = function($scope, successCallback, failureCallback) {
        $http.post(this.baseURL + '/companyFunc', $scope.currentCompany)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            })
    }

    this.findCompany = function($scope, successCallback, failureCallback) {
        if($scope.currentCompany.companyId && $scope.currentCompany.companyId != -1) {
            var urlString = this.baseURL + '/companyFunc/' + $scope.currentCompany.companyId;
            //console.log(urlString);
            $http.get(urlString)
                .then(function(response) {
                    //Note the difference in response.data being in an array which is different than behaviore 
                    //from person service
                    successCallback(response.data)
                }, function(response) {
                    failureCallback()
                })
        }
        else {
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
            if($scope.currentCompany.id) {
                queryString += 'companyId=' + $scope.currentCompany.id + '&'
            }
            console.log(queryString)
            //console.log(this.baseURL + '/person' + queryString)
            $http.get(this.baseURL + '/companyFunc' + queryString)
                .then(function(response) {
                    console.log(response)
                    //console.log(response.data)
                    successCallback(response.data)
                }, function(response) {
                    failureCallback()
                });
        }
    }
  });
