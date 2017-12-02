'use strict';

/**
 * @ngdoc service
 * @name teapotApp.HRservice
 * @description
 * # HRservice
 * Service in the teapotApp.
 */
angular.module('teapotApp')
  .service('HRService', function ($http, teauuid, etag) {
	//this.baseURL = 'http://HR-env.n924wyqpyp.us-east-1.elasticbeanstalk.com:8000'
    this.baseURL = 'https://0j1j9o13l2.execute-api.us-east-1.amazonaws.com/prod'

    this.getHR = function($scope) {
        var config = {}
        if($scope.currentHR.etag) {
            config = {'etag' : $scope.currentHR.etag}
        }
        $http.get($scope.currentHR.self.href, config)
            .then(function(response) {
                console.log(response.headers('etag'))
                $scope.currentHR = response.data[0];
                $scope.currentHR.etag = response.headers('etag');
                console.log($scope.currentHR);
            }, function(response) {
                console.log('error occured')
            })
    }

    this.getHRs = function($scope) {
        $http.get(this.baseURL + '/employeeFunc2/page/'+$scope.pageNumber)
            .then(function(response) {
                console.log('h')
                console.log(response)
                $scope.HRs = response.data
                $scope.maxPages = response.data[0].totalPages
                //console.log($scope.HRs)
            }, function(response) {
                console.log(response.data)
            })
    }

    this.getHRPage = function($scope, pageRequested, successCallback, failureCallback) {
        $http.get(this.baseURL + '/employeeFunc2/page/'+pageRequested)
            .then(function(response) {
                //console.log(response.data)
                $scope.HRs = response.data
                successCallback()
            }, function(response) {
                console.log(response.data)
                failureCallback()
            });
    }

    this.deleteHR = function($scope, successCallback, failureCallback) {
        var idemKeyStr = teauuid.makeUuid()
        $http.delete(this.baseURL+'/employeeFunc2/'+$scope.currentHR.employeeId, {headers:{'idem-key':idemKeyStr}})
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.updateHR = function($scope, successCallback, failureCallback) {
        var idemKeyStr = teauuid.makeUuid()
        console.log('in UpdateHR')
        console.log($scope.currentHR)
        console.log('idem key')
        console.log(teauuid.makeUuid())
        $scope.currentHR.personId = $scope.currentPerson.personId;
        $scope.currentHR.companyId = $scope.currentCompany.companyId;        
        $http.put(this.baseURL+'/employeeFunc2/'+$scope.currentHR.employeeId, $scope.currentHR, {headers:{
                                        'idem-key':idemKeyStr,'etag':$scope.currentHR.etag}})
            .then(function(response) {
                console.log(response)
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.createHR = function($scope, successCallback, failureCallback) {
        var idemKeyStr = teauuid.makeUuid()
        console.log($scope.currentHR);
        console.log($scope.currentPerson);
        console.log($scope.currentCompany);
        $scope.currentHR.personId = $scope.currentPerson.personId;
        $scope.currentHR.companyId = $scope.currentCompany.companyId;
        $http.post(this.baseURL + '/employeeFunc2', $scope.currentHR, {headers:{'idem-key':idemKeyStr}})
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            })
    }
  });
