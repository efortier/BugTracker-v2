"use strict";

var mod = angular.module("thisApp");

mod.factory("AuthService", function($http, BTCONFIGS) {
  var authService = {
    user: {
      userName: String = null,
      userRealName: String = null,
      userEmail: String = null,
      userToken: String = null
    },
    tempUser: {}
  };

  function prepEndpoint(ep) {
    // if (BTCONFIGS.isDev) 
    //   {
    //     console.log(BTCONFIGS)
    //     return BTCONFIGS.backendHost + ep;}
    return ep;
  }

  function handleError(error) {
    return { success: false, message: error };
  }

  function returnResData(res) {
    return res.data;
  }

  function clearUser()
  {
    authService.user.userId = null;
    authService.user.userName = null;
    authService.user.userRealName = null;
    authService.user.userEmail = null;
    authService.user.userToken = null;
    authService.tempUser = {};
  }

  // this function copies the tempuse to user. this allows to keep a copy
  // of the user infos and when we're ready to enable functionality, to "commit"
  // the user, thus "turning the site on".
  authService.commitUser = function() {
    authService.user = authService.tempUser;
  };

  authService.getUser = function() {
    return authService.user;
  };

  authService.checkUserExists = function(username) {
    const ep = prepEndpoint("users/exists");
    return $http.post(ep, { username: username })
      .then(returnResData, handleError);
  };

  authService.authenticate = function(username, password) {
    clearUser();
    const ep = prepEndpoint("users/authenticate");
    return $http.post(ep, { username: username, password: password }).then(

      (res) => {
        if(res.data.success)
        {
          // TODO: remove this duplication
          authService.tempUser.userId = res.data.userid;
          authService.tempUser.userName = res.data.username;
          authService.tempUser.userRealName = res.data.userrealname;
          authService.tempUser.userEmail = res.data.useremail;
          authService.tempUser.userToken = res.data.token;
        }
        return res.data;
      }, 

      handleError

      );
  };

  authService.registerUser = function(user) {

    const ep = prepEndpoint("users/register");
    return $http.post(ep, { username: user.username, password: user.password, realname: user.realname, email: user.email }).then(

      (res) => {

        if(res.data.success)
        {
          // TODO: remove this duplication
          authService.tempUser.userId = res.data.userid;
          authService.tempUser.userName = res.data.username;
          authService.tempUser.userRealName = res.data.userrealname;
          authService.tempUser.userEmail = res.data.useremail;
          authService.tempUser.userToken = res.data.token;
        }
        return res.data;
      }, 

      handleError

      );
  };

  authService.getAuthorizationHeader = function() {

    if(authService.user.userToken) {
      return { headers: {'Authorization': authService.user.userToken} };
    }
    else {
      return null;
    }
  }

  authService.isAuthenticated = function() {
    const ep = prepEndpoint("users/isauthenticated");
    return $http.post(ep, {}, this.getAuthorizationHeader)
      .then(returnResData, handleError);
  }

  authService.isLoggedIn = function() {
    return authService.user.userToken !== null;
  };

  authService.logOut = function() {
    clearUser();
  };

  return authService;
});
