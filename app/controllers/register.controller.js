
var mod = angular.module("thisApp.Register", ['ui.bootstrap']);

mod.directive('ngAutoFocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
      $timeout(function() {
        $element[0].focus();
      });
    }
  };
 }]);

mod.controller("RegisterController", function($scope, AuthService, $location, StringsService, ModalService, $timeout) {

	$scope.realname = '';
	$scope.email = '';
	$scope.username = '';
	$scope.password = '';
	$scope.password2 = '';
	$scope.formdisabled = false;

	$scope.$on('$viewContentLoaded', function(event) {
		// if we're here, we're not supposed to be logged on.
		AuthService.logOut();
		// $timeout( function() {
		// 	$scope.formdisabled = false;
		// }, 250, true );
    });

	$scope.cancelClick = function() {
		$location.path("/home");
	};
 
	$scope.createClick = function() {

	    const user = {
	      	username: $scope.username,
	      	password: $scope.password,
	      	realname: $scope.realname,
	      	email: $scope.email,
	    };

    	if(StringsService.isStringEmpty($scope.realname)) 
    	{
       		ModalService.showModal( $scope, "Veuillez entrer votre prénom et nom.", 'Fermer', 'bt-reg-realname');
     		return;
    	}

    	if(StringsService.isStringEmpty($scope.email)) 
    	{
    		ModalService.showModal( $scope, "Veuillez entrer votre adresse courriel.", 'Fermer', 'bt-reg-email');
     		return;
    	}

    	if(StringsService.isStringEmpty($scope.username)) 
    	{
    		ModalService.showModal( $scope, "Veuillez entrer votre nom d'utilisateur.", 'Fermer', 'bt-reg-username');
     		return;
    	}

    	if(StringsService.isStringEmpty($scope.password)) 
    	{
    		ModalService.showModal( $scope, "Veuillez entrer votre mot de passe.", 'Fermer', 'bt-reg-password');
     		return;
    	}

    	if(StringsService.isStringEmpty($scope.password2)) 
    	{
    		ModalService.showModal( $scope, "Veuillez inscrire votre mot de passe une deuxième fois à des fins de verification.", 'Fermer', 'bt-reg-password2');
     		return;
    	}

    	if(StringsService.isStringSameNotNull($scope.password, $scope.password2)) 
    	{
    		$scope.password = "";
    		$scope.password2 = "";
    		ModalService.showModal( $scope, "Vos mots de passe ne sont pas identique. Veuillez essayer à nouveau.", 'Fermer', 'bt-reg-password');
     		return;
    	}

    	AuthService.checkUserExists(user.username).then(

    		(res) => 
    		{
    			if(res.success)
    			{
		    		ModalService.showModal( $scope, "Ce nom d'utilisateur existe déjà.", 'Fermer', 'bt-reg-username');
		    		return;
    			}

		    	AuthService.registerUser(user).then(

		    		(res) => 
		    		{
		    			if(!res.success)
		    			{
				    		ModalService.showModal( $scope, "Erreur dans la création du compte.", 'Fermer');
		    			}
		    			else
		    			{
					    	ModalService.showModalCallback( $scope, "Votre compte a été créer avec succès!", 'Poursuivre', () => {
		  						AuthService.commitUser();
		  						$location.path('/issues');
		  					});
		    			}
		    		},

		    		(err) => 
		    		{
			    		ModalService.showModal( $scope, "Erreur dans la création du compte.", 'Fermer');
		    		}

		    	);

    		},

    		(err) => {
	    		ModalService.showModal( $scope, "Erreur de vérification du nom de l'utilisateur.", 'Fermer');
    		}

    	);

	    return true;

	};

});
