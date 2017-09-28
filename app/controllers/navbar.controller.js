
var mod = angular.module("thisApp.Navbar", []);

mod.controller("NavbarController", function($scope, $location, AuthService, IssuesService, $rootScope, $timeout) {

    $scope.bugsCount = 0;

    // or $viewContentLoaded?
    $scope.$on('$routeChangeStart', function() { 
        IssuesService.updateTotalIssuesCount().then(
            (res) => {
                $scope.bugsCount = IssuesService.getBugsCount();
            },
            (err) => {
            }
        );
    });

    $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.isLoggedIn = function() {
        return AuthService.isLoggedIn();
    };

    $scope.onLogoutClick = function() {
        AuthService.logOut();
        $location.path('/logout');
        // $timeout(() =>{
        //     $rootScope.$broadcast('requestLogout', $location.path());
        // },1);
    };

    $scope.onRegisterClick = function() {
    	$location.path('/register');
    }

});