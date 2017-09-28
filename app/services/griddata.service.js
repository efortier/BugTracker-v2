
"use strict";

var mod = angular.module("thisApp");

mod.factory("GridDataService", function() {
  	var thisService = {
  	};

  	thisService.getNewPage = function() {
	    return {
			pageNumber: 0,
			pageSize: 0,
			totalElements: 0,
			totalPages: 0,
			titleFilter: '',
			projectFilter: '',
			typeFilter: '',
			severityFilter: '',
			statusFilter: ''
	    };
  	};

  	thisService.getNewRecord = function() {
	    return {
			issue_id: '',
			issue_author: '',
			issue_title: '',
			issue_description: '',
			issue_project: '',
			issue_priority: 0,
			issue_type: '',
			issue_status: '',
			issue_date: '',
			issue_severity: '',
			issue_tags: '',
			issue_feedback: '',
			issue_assignee: '',
			issue_action: ''
	    };
  	};

  return thisService;

});
