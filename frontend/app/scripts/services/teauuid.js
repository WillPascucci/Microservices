'use strict';

/**
 * @ngdoc service
 * @name teapotApp.teauuid
 * @description
 * # teauuid
 * Service in the teapotApp.
 */
angular.module('teapotApp')
  .service('teauuid', function () {
    this.makeUuid = function guid() {
		  function s4() {
		    return Math.floor((1 + Math.random()) * 0x10000)
		      .toString(16)
		      .substring(1);
		  }
		  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		    s4() + '-' + s4() + s4() + s4();
		};
  });
