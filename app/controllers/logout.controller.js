
var app = angular.module("thisApp.Logout", []);

app.controller("LogoutController", function($scope, AuthService, $rootScope) {

	// function showModalRedirect( content, close, redirect ) {
	// 	$scope.modalContent = content;
	// 	$scope.modalClose = close;

	// 	if(redirect)
	// 	{
	// 		$('#myModal').on('hidden.bs.modal', function () {
 //    	    	$location.path(redirect);
 //        		$scope.$apply();
 //    		});
	// 	}

	// 	$('#myModal').modal({keyboard: true});

	// }

 //    $rootScope.$on('requestLogout', function(event, data) {
 //    	console.log('logged out')
 //        //AuthService.logOut();
 //        showModalRedirect('Vous êtes maintenant déconnecté!', 'Fermer');
 //    }); 

});
