'use strict';

/**
 * @ngdoc service
 * @name teapotApp.personService
 * @description
 * # personService
 * Service in the teapotApp.
 */
angular.module('teapotApp')
  .service('personService', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.baseURL = 'http://person-env.n924wyqpyp.us-east-1.elasticbeanstalk.com:8000'
    //this.baseURL = 'https://0j1j9o13l2.execute-api.us-east-1.amazonaws.com/prod'

    this.getPersons = function($scope) {
        $http.get(this.baseURL + '/person/page/'+$scope.pageNumber)
            .then(function(response) {
                $scope.persons = response.data
                $scope.maxPages = response.data[0].totalPages
                console.log($scope.persons)
            }, function(response) {
                console.log(response.data)
            })
    }

    this.getPersonLink = function($scope, link) {
        $http.get(link)
            .then(function(response) {
                $scope.currentPerson = response.data[0]
            }, function(response) {
                console.log(response)
            })
    }

    this.getPersonPage = function($scope, pageRequested, successCallback, failureCallback) {
        $http.get(this.baseURL + '/person/page/'+pageRequested)
            .then(function(response) {
                console.log(response.data)
                $scope.persons = response.data
                successCallback()
            }, function(response) {
                console.log(response.data)
                failureCallback()
            });
    }

    this.deletePerson = function($scope, successCallback, failureCallback) {
        $http.delete(this.baseURL+'/person/'+$scope.currentPerson.id)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.updatePerson = function($scope, successCallback, failureCallback) {
        console.log($scope.currentPerson)
        $http.put(this.baseURL+'/person/'+$scope.currentPerson.id, $scope.currentPerson)
            .then(function(response) {
                console.log(response)
                successCallback()
            }, function(response) {
                failureCallback()
            });
    }

    this.createPerson = function($scope, successCallback, failureCallback) {
        $http.post(this.baseURL + '/person', $scope.currentPerson)
            .then(function(response) {
                successCallback()
            }, function(response) {
                failureCallback()
            })
    }

    this.findPerson = function($scope, successCallback, failureCallback) {
        if($scope.currentPerson.personId && $scope.currentPerson.personId != -1) {
            var urlString = this.baseURL + '/person/' + $scope.currentPerson.personId;
            //console.log(urlString);
            $http.get(urlString)
                .then(function(response) {
                    //The data is put in an array to match the data return type of an array
                    //From the else case below using a query
                    successCallback([response.data])
                }, function(response) {
                    failureCallback()
                })
        }
        else {
            var queryString = '?'
            if($scope.currentPerson.firstname) {
                queryString += 'firstname=' + $scope.currentPerson.firstname + '&'
            }
            if($scope.currentPerson.lastname) {
                queryString += 'lastname=' + $scope.currentPerson.lastname + '&'
            }
            if($scope.currentPerson.age) {
                queryString += 'age=' + $scope.currentPerson.age + '&'
            }
            if($scope.currentPerson.phone) {
                queryString += 'phone=' + $scope.currentPerson.phone + '&'
            }
            console.log(queryString)
            //console.log(this.baseURL + '/person' + queryString)
            $http.get(this.baseURL + '/person' + queryString)
                .then(function(response) {
                    //console.log(response.data)
                    successCallback(response.data)
                }, function(response) {
                    failureCallback()
                });
        }
    }


    /*
    this.getPerson = function(personID) {
    	return $http.get(this.baseURL+'/person/'+personID);
    }

    this.createPerson = function(person) {
    	return $http.post(this.baseURL+'/person');
    }

    this.changePerson = function(person) {
    	return $http.post(this.baseURL + '/person/'+person.personID);
    }

    this.getPersonPage = function(pagenum) {
    	return $http.get(this.baseURL +'/person', {
    		pageNum: pagenum
    	});
    }
    */
  });
