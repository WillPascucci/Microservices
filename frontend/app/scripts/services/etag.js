'use strict';

/**
 * @ngdoc service
 * @name teapotApp.etag
 * @description
 * # etag
 * Service in the teapotApp.
 */
angular.module('teapotApp')
  .service('etag', function () {
    this.makeEtag = function(business_object, type) {
    	var etag = '';
    	var keys = []
    	if(type == 'HR') {
    		keys = ['companyId', 'personId', 'salary', 'title'];
    	} else if(type == 'CRM') {
    		keys = ['companyId', 'dollarsSpent', 'personId'];
    	}
    	else {
    		keys = []
    		console.log('Unexpected etag type')
    	}
    	for(var i = 0; i < keys.length; i++) {
    		etag += keys[i] + ':' + business_object[keys[i]] + ';'
    	}
    	return etag
    }
  });
