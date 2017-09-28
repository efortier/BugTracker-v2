
var mod = angular.module("thisApp.Issues", ['data-table']);
var dataTable = angular.module('data-table');

mod.controller("IssuesController", function($scope, AuthService, $location, GridDataService, IssuesService,
	DateService) {

ngx_rows = [];

	ngx_columns = [
    { name: 'Titre du problème', prop: 'issue_title', flexGrow: 1, width: 100, resizable: true},
    //{ name: 'Actions', prop: 'issue_action', width:64, maxWidth:64, resizeable: false, sortable: false, },
    { name: 'Projet', prop: 'issue_project', width: 120, minWidth: 120, maxWidth: 120, resizeable: false,  sortable: false,},
    { name: 'Type', prop: 'issue_type', width: 120, minWidth: 120, maxWidth: 120, resizeable: false,  sortable: false,},
    { name: 'Gravité', prop: 'issue_severity', width: 80, minWidth: 80, maxWidth: 80, resizeable: false,  sortable: false,},
    { name: 'État', prop: 'issue_status', width: 120, minWidth: 120, maxWidth: 120, resizeable: false,  sortable: false,},
    { name: 'Date création', prop: 'issue_date', width: 210, minWidth: 210, maxWidth: 210, resizeable: false,  sortable: false,},
  	];	

	TableDefaults = {
		scrollbarV: true,
		rowHeight: 30,
		columnMode: 'standard',
		loadingMessage: 'Recherche...',
		emptyMessage: 'Aucun rapport à afficher',
		headerHeight: 30,
		footerHeight: 0,
		paging: {
			externalPaging: false,
			size: undefined,
			count: 0,
			offset: 0,
			loadingIndicator: false
		},
		selectable: false,
		multiSelect: false,
		checkboxSelection: false,
		reorderable: true,
		internal: {
			offsetX: 0,
			offsetY: 0,
			innerWidth: 0,
			bodyHeight: 302
		}
	};

  	$scope.a = TableDefaults;
  	$scope.a.scrollbarV = true;
  	$scope.a.columnMode = 'flex';
  	$scope.a.columns = ngx_columns;
  	$scope.a.paging.externalPaging = true;
  	$scope.ngx_options = $scope.a;

    $scope.$on('$viewContentLoaded', function() { 
		moment.locale( 'bt-v2' );
    	$scope.page = GridDataService.getNewPage();
    	$scope.page.pageSize = 10;
    	$scope.page.pageNumber = 0;
    	$scope.loadPage({pageNumber: 0});
    	$scope.loadSettings();
    	//$scope.getAllIssues();
    	//$scope.ngx_options.internal.bodyHeight = 321;
    });

    $scope.ngx_rows = [];

    $scope.pagerPageNumber = 1;

    $scope.btProjects = [];
    $scope.btTypes = [];
    $scope.btSeverity = [];
    $scope.btUsers = [];
    $scope.btStates = [];

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
                            //$scope.getReport($scope.reportid);
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

    $scope.getAllIssues = function()
    {

	    //$scope.ngx_options.paging.loadingIndicator = false;
	    IssuesService.getAllIssues({}).then(

	    	res => {
		       	$scope.ngx_rows = $scope.ngx_rows.splice(0,$scope.ngx_rows.length); //new Array(res.issues.length);
		       	$scope.ngx_options.scrollbarV = false;
		       	var newrows = [];
	         	for (let i = 0; i < res.issues.length; i++) 
	         	{
	        		var e = new GridDataService.getNewRecord();
					e.issue_id = res.issues[i]._id,
					e.issue_author = res.issues[i].issue_author,
					e.issue_title = res.issues[i].issue_title,
					e.issue_description = res.issues[i]._id;
					e.issue_assignee = res.issues[i].issue_assignee;
					e.issue_feedback = res.issues[i].issue_feedback;
					e.issue_priority = res.issues[i].issue_priority;
					e.issue_project = res.issues[i].issue_project;
					e.issue_severity = res.issues[i].issue_severity;
					e.issue_status = res.issues[i].issue_status;
					e.issue_tags = res.issues[i].issue_tags;
					e.issue_type = res.issues[i].issue_type;
					e.issue_date = moment(DateService.dateFromDbId(res.issues[i]._id)).format('llll');
					$scope.ngx_rows.push(e);
	         	}
		       	$scope.ngx_options.scrollbarV = true;
	         	//$scope.ngx_rows = newrows;
	         	// need to create a NEW array and set it.
	   //       	$scope.ngx_rows = null;
	   //       	$scope.ngx_rows = undefined;
				// $scope.ngx_rows = newrows;
	         	//$scope.ngx_options.paging.loadingIndicator = false;
	    	},

	    	err => {
	    		//$scope.ngx_options.paging.loadingIndicator = false;
	    		console.log(err);
	    	}
	    );

    };

	$scope.loadPage = function(pageInfo) {

	    $scope.page.pageNumber = pageInfo.pageNumber;
	    $scope.ngx_options.paging.loadingIndicator = true;
	    IssuesService.getIssuesByPage($scope.page).then(

	    	res => {
			    //console.log($scope.page);
	         	$scope.page.totalElements = res.totalElements;
	         	$scope.page.totalPages = $scope.page.totalElements / $scope.page.pageSize;

	         	$scope.ngx_options.paging.size = $scope.page.pageSize; //$scope.page.pageSize; //res.totalElements;
	         	$scope.ngx_options.paging.count = $scope.page.pageSize; //res.totalElements;
	         	$scope.ngx_options.paging.offset = pageInfo.pageNumber;

	         	var newrows = new Array(res.issues.length);
	         	for (let i = 0; i < res.issues.length; i++) 
	         	{
	        		var e = new GridDataService.getNewRecord();
					e.issue_id = res.issues[i]._id,
					e.issue_author = res.issues[i].issue_author,
					e.issue_title = res.issues[i].issue_title,
					e.issue_description = res.issues[i]._id;
					e.issue_assignee = res.issues[i].issue_assignee;
					e.issue_feedback = res.issues[i].issue_feedback;
					e.issue_priority = res.issues[i].issue_priority;
					e.issue_project = res.issues[i].issue_project;
					e.issue_severity = res.issues[i].issue_severity;
					e.issue_status = res.issues[i].issue_status;
					e.issue_tags = res.issues[i].issue_tags;
					e.issue_type = res.issues[i].issue_type;
					e.issue_date = moment(DateService.dateFromDbId(res.issues[i]._id)).format('llll');
					newrows[i] = e;
	         	}
	         	$scope.ngx_rows = newrows;
	         	$scope.ngx_options.paging.loadingIndicator = false;
	    	},

	    	err => {
	         	$scope.ngx_options.paging.loadingIndicator = false;
	    		console.log(err);
	    	}
	    );

	    
	};

	$scope.pagerClicked = function(page, pageSize, total) {
		$scope.loadPage({pageNumber: page-1});
	};

	$scope.resetFilters = function() {
	    $scope.page.titleFilter = '';
	    $scope.page.projectFilter = '';
	    $scope.page.typeFilter = '';
	    $scope.page.severityFilter = '';
	    $scope.page.statusFilter = '';
	    $scope.loadPage({pageNumber: 0});
	};

	$scope.refreshFilters = function() {
		$scope.pagerPageNumber = 0;
	    $scope.loadPage({pageNumber: 0});
	};

	$scope.setPageSize = function(size) {
		$scope.page.pageSize = size;
	    $scope.loadPage({pageNumber: 0});
	};

	$scope.rowClicked = function(row) {
		$location.path('/viewissue').search({report_id: row.issue_id});
	};



});
