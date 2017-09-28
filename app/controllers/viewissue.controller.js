
var app = angular.module("thisApp.ViewIssue", ['angular-confirm']);

app.controller("ViewIssueController", function($scope, AuthService, $location, StringsService, ModalService,
    IssuesService) {
    
	$scope.reportid = null;

    $scope.btProjects = [];
    $scope.btTypes = [];
    $scope.btSeverity = [];
    $scope.btUsers = [];
    $scope.btStates = [];

    $scope.btReport = {
        isValid: false,
        issue_project: '',
        issue_author: '',
        issue_title: '',
        issue_description: '',
        issue_feedback: '',
        issue_type: '',
        issue_severity: '',
        issue_status: '',
        issue_assignee: '',
        issue_tags: '',
    };

	$scope.$on('$viewContentLoaded', function(event) {
		$scope.reportid = $location.search().report_id;
        $scope.loadSettings();
    });

    function validateExistingReport(report) {
        if ( StringsService.isStringEmpty( report.issue_project ) ) return false;
        if ( StringsService.isStringEmpty( report.issue_author ) ) return false;
        if ( StringsService.isStringEmpty( report.issue_title ) ) return false;
        if ( StringsService.isStringEmpty( report.issue_description ) ) return false;
        if ( StringsService.isStringEmpty( report.issue_type ) ) return false;
        if ( StringsService.isStringEmpty( report.issue_severity ) ) return false;
        if ( StringsService.isStringEmpty( report.issue_status ) ) return false;
        return true;
    }

    $scope.loadSettings = function() {
        $scope.getListOf('projects', (list) => { 
            $scope.btProjects = list;
            $scope.getListOf('types', (list) => { 
                $scope.btTypes = list;
                $scope.getListOf('severity', (list) => { 
                    $scope.btSeverity = list;
                    $scope.getListOf('users', (list) => { 
                        $scope.btUsers = list;
                        $scope.getListOf('states', (list) => { 
                            $scope.btStates = list;
                            $scope.getReport($scope.reportid);
                        } );
                    } );
                } );
            } );
        } );
    };

    $scope.getListOf = function( listId, callback ) {
        IssuesService.getListOf(listId).then(
            res => {
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
            err => {
                callback([]);
            }
        );
    };

    $scope.validateReport = function() {
        $scope.btReport.isValid = validateExistingReport($scope.btReport);
    };

    $scope.getReport = function(report_id) {

        IssuesService.getReport(report_id).then(

            res => {

                if(!res.success)
                {
                    ModalService.showModalRedirect( $scope, "Impossible d'afficher ce rapport.", "Fermer", '/issues');
                } 
                else 
                {
                    $scope.btReport = res.report;
                    $scope.btReport.isValid = false;
//                    console.log($scope.btReport)
                }
            },

            err => {
                ModalService.showModal( $scope, "", "Fermer");
            }

        );
    };

    $scope.deleteClick = function() {
      IssuesService.deleteReport($scope.reportid).then(
        res => {
            if(!res.success) {
                ModalService.showModal( $scope, "Impossible de supprimer ce rapport.", "Fermer");
            } else {
                ModalService.showModalRedirect( $scope, "Rapport supprimé.", "Fermer", '/issues');
            }
        },
        err => {
            ModalService.showModal( $scope, "Impossible de supprimer ce rapport.", "Fermer");
        });
    };

    $scope.cancelClick = function() {
        $location.path('/issues');
    };

    $scope.updateClick = function() {
        IssuesService.updateReport($scope.btReport).then(
        res => {
            if(!res.success) {
                ModalService.showModal( $scope, "Impossible de sauvegarder ce rapport.", "Fermer");
            } else {
                $location.path('/updateconfirm').search({report_id: $scope.reportid});
            }
        },
        err => {
            ModalService.showModal( $scope, "Impossible de sauvegarder ce rapport.", "Fermer");
        });
    };

});

