"use strict";

var mod = angular.module("thisApp");

mod.factory("IssuesService", function($http, BTCONFIGS, AuthService, $q, $location) {
  var issuesService = {
      totalIssues: 0
  };

  function prepEndpoint(ep) {
    if (BTCONFIGS.isDev) return BTCONFIGS.backendHost + ep;
    return ep;
  }

  function handleError(error) {
    return { success: false, message: error };
  }

  function returnResData(res) {
    return res.data;
  }

  // @todo: refactor this function. maybe use callbacks.
  issuesService.updateTotalIssuesCount = function() {

    if(AuthService.isLoggedIn()) {

      const ep = prepEndpoint("issues/getissuescount");
      return $http.get(ep, AuthService.getAuthorizationHeader()).then( 

        (res) => {
          if(res.data.noauth && res.data.noauth === true ) {
            AuthService.logOut();
            $location.path("/");
          }
          else if(!res.data.success) {
            issuesService.totalIssues = 0;
          }
          else {
            issuesService.totalIssues = res.data.count;
          }
          return res.data;
        }, 

        handleError

        );
    }
    else
    {
      // since we do not have a promise to return, create one
      var deferred = $q.defer();
      deferred.reject({success:false});
      return deferred.promise;
    }

  };

  issuesService.getBugsCount = function() {
    if(!issuesService.totalIssues || issuesService.totalIssues === 0) return "0";
    if(issuesService.totalIssues > 0 ) return issuesService.totalIssues;
    return "?";
  };

  issuesService.getListOf = function(listId) {

    const ep = prepEndpoint("issues/get" + listId);
    return $http.get(ep, AuthService.getAuthorizationHeader()).then( 

      (res) => {

        if(res.data.noauth && res.data.noauth === true ) 
        {
          AuthService.logOut();
          $location.path("/");
        }

        return res.data;
      }, 

      handleError

      );
  };

  issuesService.saveReport = function(report) {

    const ep = prepEndpoint("issues/savereport");
    return $http.post(ep, report, AuthService.getAuthorizationHeader()).then( 

      (res) => {

        if(res.data.noauth && res.data.noauth === true ) 
        {
          AuthService.logOut();
          $location.path("/");
        }

        return res.data;
      }, 

      handleError

      );
  };

  issuesService.getReport = function(reportId) {

    const ep = prepEndpoint("issues/getreport");
    return $http.post(ep, {report_id: reportId}, AuthService.getAuthorizationHeader()).then( 

      (res) => {
        if(res.data.noauth && res.data.noauth === true ) 
        {
          AuthService.logOut();
          $location.path("/");
        }

        return res.data;
      }, 

      (err) => {
        return { success: false, message: err };
      }

      );
  };

  issuesService.deleteReport = function(reportId) {

    const ep = prepEndpoint("issues/deletereport");
    return $http.post(ep, {report_id: reportId}, AuthService.getAuthorizationHeader()).then( 

      (res) => {

        if(res.data.noauth && res.data.noauth === true ) 
        {
          AuthService.logOut();
          $location.path("/");
        }

        return res.data;
      }, 

      handleError

      );
  };

  issuesService.updateReport = function(report) {

    const ep = prepEndpoint("issues/updatereport");
    return $http.post(ep, report, AuthService.getAuthorizationHeader()).then( 

      (res) => {

        if(res.data.noauth && res.data.noauth === true ) 
        {
          AuthService.logOut();
          $location.path("/");
        }

        return res.data;
      }, 

      handleError

      );
  };

  issuesService.getIssuesByPage = function(page) {

    const ep = prepEndpoint("issues/getpage");
    return $http.post(ep, page, AuthService.getAuthorizationHeader()).then( 

      (res) => {

        if(res.data.noauth && res.data.noauth === true ) 
        {
          AuthService.logOut();
          $location.path("/");
        }

        return res.data;
      }, 

      handleError

      );
  };

  issuesService.getAllIssues = function(filters) {

    const ep = prepEndpoint("issues/getallissues");
    return $http.post(ep, filters, AuthService.getAuthorizationHeader()).then( 

      (res) => {

        if(res.data.noauth && res.data.noauth === true ) 
        {
          AuthService.logOut();
          $location.path("/");
        }

        return res.data;
      }, 

      handleError

      );
  };

  return issuesService;

});

