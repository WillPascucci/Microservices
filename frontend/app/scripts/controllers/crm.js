'use strict';

/**
 * @ngdoc function
 * @name teapotApp.controller:CrmCtrl
 * @description
 * # CrmCtrl
 * Controller of the teapotApp
 */
angular.module('teapotApp')
  .controller('CrmCtrl', function ($scope, CRMService, personService, companyService) {
  	$scope.alertTypes = ['alert alert-success', 'alert alert-info', 'alert alert-warning', 'alert alert-danger']

  	$scope.personFoundMessage = 'Person Found!'
  	$scope.personNotCheckedMessage = 'Please check person'
  	$scope.personNotFoundMessage = 'Person Doest not exist'
  	$scope.personFound = false;
  	$scope.personChecked = false;
  	$scope.personAlertType = ''
  	$scope.personAlertMessage = ''

  	$scope.companyFoundMessage = 'Company Found!'
  	$scope.companyNotCheckedMessage = 'Please check company'
  	$scope.companyNotFoundMessage = 'Company Doest not exist'
  	$scope.companyFound = false;
  	$scope.companyChecked = false;
  	$scope.companyAlertType = ''
  	$scope.companyAlertMessage = ''

	$scope.pageNumber = 0;
    $scope.maxPages = 0;
    CRMService.getCRMs($scope);
    $scope.blankCRM = {
      id: -1
    }
    $scope.currentCRM = JSON.parse(JSON.stringify($scope.blankCRM));

    $scope.blankPerson = {
    	id: -1
    }

    $scope.blankCompany = {
    	id: -1
    }

    $scope.currentPerson = JSON.parse(JSON.stringify($scope.blankPerson))

    $scope.currentCompany = JSON.parse(JSON.stringify($scope.blankCompany))
    $scope.pickCRM = function(CRM) {
      console.log($scope.currentCRM);
      $scope.currentCRM = JSON.parse(JSON.stringify(CRM));
      console.log($scope.currentCRM);
    }

    $scope.nextPage = function() {
      console.log('next page called')
      if($scope.pageNumber + 1 < $scope.maxPages) {
        CRMService.getCRMPage($scope, $scope.pageNumber + 1, function() {
          console.log('Next Page Success')
          $scope.pageNumber++;
        }, function() {
          console.log('Next Page Failure')
        })
      }
    }

    $scope.prevPage = function() {
      if($scope.pageNumber - 1 >= 0) {
        CRMService.getCRMPage($scope, $scope.pageNumber - 1, function() {
          console.log('Prev Page Success')
          $scope.pageNumber--;
        }, function() {
          console.log('Prev Page Failure')
        })
      }
    }

    $scope.saveCRM = function() {
      console.log($scope.currentCRM)
      if($scope.currentCRM.uuid == -1) {
        delete $scope.currentCRM.uuid
        CRMService.createCRM($scope, function() {
          CRMService.getCRMs($scope);
          $scope.currentCRM = JSON.parse(JSON.stringify($scope.blankCRM));
          console.log('Success');
        }, function() {
          console.log('Failure');
        })
      }
      else {
        CRMService.updateCRM($scope, function() {
          CRMService.getCRMs($scope);
          $scope.currentCRM = JSON.parse(JSON.stringify($scope.blankCRM));
          console.log('Success');
        }, function() {
          console.log('Failure');
        })
      }
      //CRMService.
    }

    $scope.clearCRM = function() {
      //debugger;
      $scope.currentCRM = JSON.parse(JSON.stringify($scope.blankCRM));
      //debugger;
    }

    $scope.clearPerson = function() {
    	$scope.currentPerson = JSON.parse(JSON.stringify($scope.blankPerson));
    	console.log($scope.blankPerson);
    	$scope.personChecked = false;
    	$scope.personFound = false;
    	$scope.personAlertType = '';
    	$scope.personAlertMessage = '';
    	//$scope.updatePersonAlert()
    }

  	$scope.clearCompany = function() {
    	$scope.currentCompany = JSON.parse(JSON.stringify($scope.blankCompany));
    	console.log($scope.blankCompany);
    	$scope.companyChecked = false;
    	$scope.companyFound = false;
    	$scope.companyAlertType = '';
    	$scope.companyAlertMessage = '';
    	//$scope.updateCompanyAlert()
    }

    $scope.deleteCRM = function() {
      CRMService.deleteCRM($scope, function() {
          CRMService.getCRMs($scope);
          $scope.currentCRM = JSON.parse(JSON.stringify($scope.blankCRM));
          console.log('Success');
        }, function() {
          console.log('Failure');
        });
    }

   $scope.personTextChanged = function() {
    	$scope.personChecked = false;
    	$scope.personFound = false;
    	$scope.updatePersonAlert()
    }

    $scope.companyTextChanged = function() {
    	$scope.companyChecked = false;
    	$scope.companyFound = false;
    	$scope.updateCompanyAlert()
    }

    $scope.updatePersonAlert = function() {
    	if($scope.personChecked && $scope.personFound) {
    		$scope.personAlertType = $scope.alertTypes[0]
    		$scope.personAlertMessage = $scope.personFoundMessage
    	} else if($scope.personChecked && !$scope.personFound) {
    		$scope.personAlertType = $scope.alertTypes[3]
    		$scope.personAlertMessage = $scope.personNotFoundMessage
    	} else {
    		$scope.personAlertType = $scope.alertTypes[2]
    		$scope.personAlertMessage = $scope.personNotCheckedMessage
    	}
    }

    $scope.updateCompanyAlert = function() {
    	if($scope.companyChecked && $scope.companyFound) {
    		$scope.companyAlertType = $scope.alertTypes[0]
    		$scope.companyAlertMessage = $scope.companyFoundMessage
    	} else if($scope.companyChecked && !$scope.companyFound) {
    		$scope.companyAlertType = $scope.alertTypes[3]
    		$scope.companyAlertMessage = $scope.companyNotFoundMessage
    	} else {
    		$scope.companyAlertType = $scope.alertTypes[2]
    		$scope.companyAlertMessage = $scope.companyNotCheckedMessage
    	}
    }

    $scope.findPerson = function() {
	    if(!$scope.currentPerson.firstname && !$scope.currentPerson.lastname && !$scope.currentPerson.age && !$scope.currentPerson.phone) {
	    	$scope.personAlertType = $scope.alertTypes[1]
    		$scope.personAlertMessage = 'Empty Person'
	    } else {
	    	personService.findPerson($scope, function(data) {
	    		if(data.length > 0) {
	    			console.log(data)
	    			console.log(data.length)
			    	if(data.length == 1) {
			    		$scope.currentPerson = data[0]
		    			$scope.personChecked = true;
		    			$scope.personFound = true;
		    			$scope.updatePersonAlert()
			    	} else {
			    		$scope.personAlertType = $scope.alertTypes[2]
			    		$scope.personAlertMessage = 'Too many people found'
			    	}
			    }
			    else {
			    	console.log('?')
			    	$scope.personChecked = true;
    				$scope.personFound = false;
    				$scope.updatePersonAlert()
			    }
	    	}, function() {
	    		$scope.personChecked = true;
	    		$scope.personFound = false;
	    		console.log('Failure')
	    	});
	    }
    }

    $scope.findCompany = function() {
	    if(!$scope.currentCompany.firstname && !$scope.currentCompany.lastname && !$scope.currentCompany.age && !$scope.currentCompany.phone) {
	    	$scope.companyAlertType = $scope.alertTypes[1]
    		$scope.companyAlertMessage = 'Empty Company'
	    } else {
	    	companyService.findCompany($scope, function(data) {
	    		if(data.length > 0) {
	    			console.log(data)
	    			console.log(data.length)
			    	if(data.length == 1) {
			    		$scope.currentCompany = data[0]
		    			$scope.companyChecked = true;
		    			$scope.companyFound = true;
		    			$scope.updateCompanyAlert()
			    	} else {
			    		$scope.companyAlertType = $scope.alertTypes[2]
			    		$scope.companyAlertMessage = 'Too many people found'
			    	}
			    }
			    else {
			    	console.log('?')
			    	$scope.companyChecked = true;
    				$scope.companyFound = false;
    				$scope.updateCompanyAlert()
			    }
	    	}, function() {
	    		$scope.companyChecked = true;
	    		$scope.companyFound = false;
	    		console.log('Failure')
	    	});
	    }
    }
  });
