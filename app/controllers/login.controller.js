
var app = angular.module("thisApp.Login", ['ui.bootstrap']);

app.controller("LoginController", function($scope, AuthService, $location, StringsService, BTCONFIGS, ModalService) {

	$scope.username = '';
	$scope.password = '';

    
    $scope.$on('$viewContentLoaded', function() { 
		// @todo: this should be completely removed on prod!
    	if (BTCONFIGS.isDev)
    	{
			$scope.username = 'efortier';
			$scope.password = 'people';
		} else console.assert('debug elements in production! REMOVE THESE!');
    });

	$scope.cancelClick = function() {
		AuthService.logOut();
		$location.path("/home");
	};

	$scope.registerClick = function() {
		$location.path('/register');
	};
	
	$scope.loginClick = function() {
		
		if(StringsService.isStringEmpty($scope.username))
    	{
    		ModalService.showModal( $scope, "Veuillez entrer votre nom d'utilisateur.", 'Fermer', 'username');
     		return;
    	}

		if(StringsService.isStringEmpty($scope.password))
    	{
    		ModalService.showModal( $scope, "Veuillez entrer votre mot de passe.", 'Fermer', 'password');
     		return;
    	}

		AuthService.authenticate( $scope.username, $scope.password ).then( 
		
		function(res) {
			if(!res.success)
			{
				AuthService.logOut();
	    		ModalService.showModal( $scope, "Erreur d'identification.", 'Fermer', '');
			} 
			else
			{
				AuthService.commitUser();
				$location.path('/issues');
			}
		}, 
		
		function(err) {
			AuthService.logOut();
			ModalService.showModal( $scope, "Erreur d'identification.", 'Fermer', '');
		});
	};

});
