"use strict";

var mod = angular.module("thisApp");

mod.factory("StringsService", function() {
  var stringsService = {
  };

  stringsService.isStringEmpty = function(str) {
    if ( str === null ) return true;
    if ( str === undefined ) return true;
    if ( str.length === 0 ) return true;
    return false;
  };

  stringsService.isStringSameNotNull = function( str1, str2 ) {
  	if(stringsService.isStringEmpty(str1)) return false;
  	if(stringsService.isStringEmpty(str2)) return false;
  	if(str1.toUpperCase() === str2.toUpperCase()) return false;
  	return true;
  };

  return stringsService;

});

