var mod = angular
    .module("thisApp.Router", ["ngRoute"])
    .config(function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.caseInsensitiveMatch = true;
        $routeProvider
            .when("/", {
                templateUrl: "./app/views/home.html",
                controller: "HomeController",
            })
            .when("/login", {
                templateUrl: "./app/views/login.html",
                controller: "LoginController"
            })
            .when("/register", {
                templateUrl: "./app/views/register.html",
                controller: "RegisterController"
            })
            .when("/issues", {
                templateUrl: "./app/views/issues.html",
                controller: "IssuesController",
                requireAuth: true
            })
            .when("/newissue", {
                templateUrl: "./app/views/newissue.html",
                controller: "NewissueController",
                requireAuth: true
            })
            .when("/newconfirm", {
                templateUrl: "./app/views/newconfirm.html",
                controller: "NewConfirmController",
                requireAuth: true
            })
            .when("/viewissue", {
                templateUrl: "./app/views/viewissue.html",
                controller: "ViewIssueController",
                requireAuth: true
            })
            .when("/updateconfirm", {
                templateUrl: "./app/views/updateconfirm.html",
                controller: "UpdateConfirmController",
                requireAuth: true
            })
            .when("/logout", {
                templateUrl: "./app/views/logout.html",
                controller: "LogoutController",
            })
            .otherwise({
                redirectTo: "/"
            });
    });
