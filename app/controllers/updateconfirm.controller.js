
var app = angular.module("thisApp.UpdateConfirm", []);

app.controller("UpdateConfirmController", function($scope, AuthService, $location) {
    
	$scope.reportid = null;

	$scope.$on('$viewContentLoaded', function(event) {
		$scope.reportid = $location.search().report_id;
    });

    $scope.isLoggedIn = function() {
        return AuthService.isLoggedIn();
    };

    $scope.createClick = function() {
    	$location.path('/newissue');
    };

    $scope.viewClick = function() {
    	$location.path('/viewissue').search({report_id: $scope.reportid});
    };

    $scope.homeClick = function() {
    	$location.path('/issues');
    };

});

