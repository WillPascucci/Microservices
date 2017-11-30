'use strict';

/**
 * @ngdoc overview
 * @name teapotApp
 * @description
 * # teapotApp
 *
 * Main module of the application.
 */
angular
  .module('teapotApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'mgcrea.ngStrap',
    //'angular-uuid'
    //'angular-oauth2'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/person', {
        templateUrl: 'views/person.html',
        controller: 'PersonCtrl',
        controllerAs: 'person'
      })
      .when('/address', {
        templateUrl: 'views/address.html',
        controller: 'AddressCtrl',
        controllerAs: 'address'
      })
      .when('/HR', {
        templateUrl: 'views/hr.html',
        controller: 'HrCtrl',
        controllerAs: 'HR'
      })
      .when('/CRM', {
        templateUrl: 'views/crm.html',
        controller: 'CrmCtrl',
        controllerAs: 'CRM'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
