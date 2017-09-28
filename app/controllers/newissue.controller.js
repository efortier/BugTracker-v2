var app = angular.module("thisApp.Newissue", []);

angular.module("chance", []).factory("chance", ["$window", function ($window) { return new $window.Chance(); }]);

app.controller("NewissueController", function($scope, AuthService, $rootScope, 
	IssuesService, $location, StringsService, ModalService, BTCONFIGS ) {
	
	$scope.btProjects = [];
	$scope.btTypes = [];
	$scope.btSeverity = [];
	$scope.btUsers = [];
	$scope.btReport = {
		isValid: 0,
		project: null,
		type: null,
		severity: null,
		title: null,
		description: null,
		tags: null,
		username: null,
		status: null
	};

	$scope.$on('$viewContentLoaded', function(event) {
		$scope.loadSettings();

		// @todo: this should be completely removed on prod!
    	if (BTCONFIGS.isDev)
    	{
    		$scope.btReport.project = 'BugTracker';
    		$scope.btReport.type = 'Interface';
    		$scope.btReport.severity = 'Fatale';
    		$scope.btReport.title = chance.profession({rank: true});
    		$scope.btReport.description = chance.paragraph({sentences: 3});
    		$scope.btReport.tags = chance.word();
    		$scope.btReport.status = 'Nouveau';
    		$scope.validateForm();
		} else console.assert('debug elements in production! REMOVE THESE!');


    });

	$scope.loadSettings = function() {
	    $scope.getListOf('projects', (list) => { 
	    	$scope.btProjects = list;
		    $scope.getListOf('types', (list) => { 
		    	$scope.btTypes = list;
			    $scope.getListOf('severity', (list) => { 
			    	$scope.btSeverity = list;
				    $scope.getListOf('users', (list) => { 
				    	$scope.btUsers = list;
				    } );
			    } );
		    } );
	    } );
	};

	validateNewReport = function(report) 
	{
		if ( StringsService.isStringEmpty( report.project ) ) return false;
		if ( StringsService.isStringEmpty( report.type ) ) return false;
		if ( StringsService.isStringEmpty( report.severity ) ) return false;
		if ( StringsService.isStringEmpty( report.title ) ) return false;
		if ( StringsService.isStringEmpty( report.description ) ) return false;
		return true;
	};

	$scope.validateForm = function() {
		$scope.btReport.isValid = validateNewReport($scope.btReport);
	};

  	$scope.getListOf = function( listId, callback ) {
	    IssuesService.getListOf(listId).then(
	    	(res) => {
				var list = [];
	    		if(res.success)
	    		{
					for(var i = 0; i < res.idlist.length; i++) 
					{
						list.push( { id: res.idlist[i], name: res.namelist[i] } );
					}
		    	}
				callback(list);
	    	},
	    	(err) => {
	    		callback([]);
	    	}
	    );
	};

	$scope.submitForm = function()
	{
	    $scope.btReport.username = AuthService.getUser().userName;
	    IssuesService.saveReport($scope.btReport).then(

	    	(res) => {
	    		
	    		if(!res.success)
	    		{
	    			ModalService.showModal( $scope, "Erreur dans l'enregistrement de ce rapport.", "Fermer");
	    		}
	    		else
	    		{
	    			$location.path('/newconfirm').search({report_id: res.report_id});
	    		}
	    	},

	    	(err) => {
    			ModalService.showModal( $scope, "Erreur dans l'enregistrement de ce rapport.", "Fermer")
	    	}

	    );

	};

	$scope.cancelForm = function()
	{
		$location.path('/issues');
	};
});
