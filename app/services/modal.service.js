"use strict";

var mod = angular.module("thisApp");

mod.factory("ModalService", function($location) {

	var thisService = {};

	thisService.showModal = function(scope, content, close, focused) {

		scope.modalContent = content;
		scope.modalClose = close;

		if(focused) 
		{
			$("#myModal").on("hidden.bs.modal", function() {
				$("#" + focused).focus();
				scope.$apply();
			});
		}

		$("#myModal").modal({ keyboard: true });

	};

	thisService.showModalRedirect = function( scope, content, close, redirect ) {

		scope.modalContent = content;
		scope.modalClose = close;

		if(redirect)
		{
			$('#myModal').on('hidden.bs.modal', function () {
    	    	$location.path(redirect);
        		scope.$apply();
    		});
		}

		$('#myModal').modal({keyboard: true});

	};

	thisService.showModalCallback = function( scope, content, close, callback ) {

		scope.modalContent = content;
		scope.modalClose = close;

		if(callback)
		{
			$('#myModal').on('hidden.bs.modal', function () {
				callback();
        		scope.$apply();
    		});
		}

		$('#myModal').modal({keyboard: true});

	};

	return thisService;

});
