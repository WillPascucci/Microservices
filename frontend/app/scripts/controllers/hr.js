'use strict';

/**
 * @ngdoc function
 * @name teapotApp.controller:HrCtrl
 * @description
 * # HrCtrl
 * Controller of the teapotApp
 */
angular.module('teapotApp')
  .controller('HrCtrl', function ($scope, HRService, personService, companyService) {
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
    HRService.getHRs($scope);
    $scope.blankHR = {
      employeeId: -1
    }
    $scope.currentHR = JSON.parse(JSON.stringify($scope.blankHR));

    $scope.blankPerson = {
    	personId: -1
    }

    $scope.blankCompany = {
    	companyId: -1
    }

    $scope.currentPerson = JSON.parse(JSON.stringify($scope.blankPerson))

    $scope.currentCompany = JSON.parse(JSON.stringify($scope.blankCompany))

    $scope.nextPage = function() {
      //console.log('next page called')
      if($scope.pageNumber + 1 < $scope.maxPages) {
        HRService.getHRPage($scope, $scope.pageNumber + 1, function() {
          //console.log('Next Page Success')
          $scope.pageNumber++;
        }, function() {
          //console.log('Next Page Failure')
        })
      }
    }

    $scope.prevPage = function() {
      if($scope.pageNumber - 1 >= 0) {
        HRService.getHRPage($scope, $scope.pageNumber - 1, function() {
          //console.log('Prev Page Success')
          $scope.pageNumber--;
        }, function() {
          //console.log('Prev Page Failure')
        })
      }
    }

    $scope.pickHR = function(HR) {
      console.log('in pick HR')
      ////console.log($scope.currentHR);
      $scope.currentHR = JSON.parse(JSON.stringify(HR));
      $scope.currentPerson.personId = $scope.currentHR.personId
      $scope.currentCompany.companyId = $scope.currentHR.companyId
      console.log('in pick HR - 2')
      console.log($scope.currentHR);
      console.log($scope.currentPerson.personId);
      console.log($scope.currentCompany.companyId);
      HRService.getHR($scope);
      $scope.findPerson();
      $scope.findCompany();
      console.log('in pick HR - 3')
      console.log($scope.currentHR);
      console.log($scope.currentPerson.personId);
      console.log($scope.currentCompany.companyId);
      ////console.log($scope.currentHR);
    }

    $scope.saveHR = function() {
      //console.log($scope.currentHR)
      if($scope.currentHR.employeeId == -1) {
        delete $scope.currentHR.employeeId
        HRService.createHR($scope, function() {
          HRService.getHRs($scope);
          $scope.currentHR =  JSON.parse(JSON.stringify($scope.blankHR));
          //console.log('Success Create');
        }, function() {
          //console.log('Failure');
        })
      }
      else {
        HRService.updateHR($scope, function() {
          HRService.getHRs($scope);
          $scope.currentHR = JSON.parse(JSON.stringify($scope.blankHR));
          //console.log('Success Update');
        }, function() {
          //console.log('Failure');
        })
      }
      //HRService.
    }

    $scope.clearHR = function() {
      //debugger;
      $scope.currentHR = JSON.parse(JSON.stringify($scope.blankHR));
      //debugger;
    }

    $scope.clearPerson = function() {
    	$scope.currentPerson = JSON.parse(JSON.stringify($scope.blankPerson));
    	//console.log($scope.blankPerson);
    	$scope.personChecked = false;
    	$scope.personFound = false;
    	$scope.personAlertType = '';
    	$scope.personAlertMessage = '';
    	//$scope.updatePersonAlert()
    }

  	$scope.clearCompany = function() {
    	$scope.currentCompany = JSON.parse(JSON.stringify($scope.blankCompany));
    	//console.log($scope.blankCompany);
    	$scope.companyChecked = false;
    	$scope.companyFound = false;
    	$scope.companyAlertType = '';
    	$scope.companyAlertMessage = '';
    	//$scope.updateCompanyAlert()
    }

    $scope.deleteHR = function() {
      HRService.deleteHR($scope, function() {
          HRService.getHRs($scope);
          $scope.currentHR = JSON.parse(JSON.stringify($scope.blankHR));
          //console.log('Success');
        }, function() {
          //console.log('Failure');
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
      //console.log('in find person')
      //console.log($scope.currentPerson.personId)
	    if(!$scope.currentPerson.firstname && !$scope.currentPerson.lastname && !$scope.currentPerson.age && 
            !$scope.currentPerson.phone && !$scope.currentPerson.personId) {

	    	$scope.personAlertType = $scope.alertTypes[1]
    		$scope.personAlertMessage = 'Empty Person'
	    } else {
	    	personService.findPerson($scope, function(data) {
          ////console.log(data)
          ////console.log(data)
	    		if(data.length > 0) {
	    			////console.log(data)
	    			////console.log(data.length)
			    	if(data.length == 1) {
			    		$scope.currentPerson = data[0]
              if(!data[0].personId) {
                $scope.currentPerson.personId = $scope.currentPerson.id
              }
		    			$scope.personChecked = true;
		    			$scope.personFound = true;
		    			$scope.updatePersonAlert()
			    	} else {
			    		$scope.personAlertType = $scope.alertTypes[2]
			    		$scope.personAlertMessage = 'Too many people found'
			    	}
			    }
			    else {
			    	//console.log('Something went wrong in find person data handling')
			    	$scope.personChecked = true;
    				$scope.personFound = false;
    				$scope.updatePersonAlert()
			    }
	    	}, function() {
	    		$scope.personChecked = true;
	    		$scope.personFound = false;
	    		//console.log('Failure')
	    	});
	    }
    }

    $scope.findCompany = function() {
	    if(!$scope.currentCompany.firstname && !$scope.currentCompany.lastname && !$scope.currentCompany.age && 
          !$scope.currentCompany.phone && !$scope.currentCompany.companyId) {
	    	$scope.companyAlertType = $scope.alertTypes[1]
    		$scope.companyAlertMessage = 'Empty Company'
	    } else {
	    	companyService.findCompany($scope, function(data) {
	    		if(data.length > 0) {
	    			console.log(data)
	    			//console.log(data.length)
			    	if(data.length == 1) {
			    		$scope.currentCompany = data[0]
              if(!data[0].companyId) {
                $scope.currentCompany.companyId = $scope.currentCompany.id
              }
		    			$scope.companyChecked = true;
		    			$scope.companyFound = true;
		    			$scope.updateCompanyAlert()
			    	} else {
			    		$scope.companyAlertType = $scope.alertTypes[2]
			    		$scope.companyAlertMessage = 'Too many companies found'
			    	}
			    }
			    else {
			    	//console.log('?')
			    	$scope.companyChecked = true;
    				$scope.companyFound = false;
    				$scope.updateCompanyAlert()
			    }
	    	}, function() {
	    		$scope.companyChecked = true;
	    		$scope.companyFound = false;
	    		//console.log('Failure')
	    	});
	    }
    }
  });
