"use strict";

var mod = angular.module("thisApp");

mod.factory("DateService", function() {
  var thisService = {
  };

  thisService.dbIdFromDate = function(date) {
    return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
  };
  
  thisService.dateFromDbId = function(objectId) {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
  };

  return thisService;

});


