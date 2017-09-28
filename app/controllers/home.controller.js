
var app = angular.module("thisApp.Home", []);

app.controller("HomeController", function($scope, AuthService, $location) {

    $scope.isLoggedIn = function() {
        return AuthService.isLoggedIn();
    };

    $scope.loginClick = function () {
    	$location.path('/login');
    };

    $scope.registerClick = function () {
    	$location.path('/register');
    };

    $scope.mainClick = function () {
    	$location.path('/issues');
    };
    
});
