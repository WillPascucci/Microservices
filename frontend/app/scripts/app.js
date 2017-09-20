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
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
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
      .otherwise({
        redirectTo: '/'
      });
  });
