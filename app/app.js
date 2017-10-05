//
// code for BugTracker v2, using angular v1.4.
//

var app = angular.module("thisApp", [
    "thisApp.Router",
    "thisApp.Navbar",
    "thisApp.Home",
    "thisApp.Login",
    "thisApp.Register",
    "thisApp.Issues",
    "thisApp.Logout",
    "thisApp.Newissue",
    "thisApp.NewConfirm",
    "thisApp.ViewIssue",
    "thisApp.UpdateConfirm"
]);

app.controller("AppController", function($scope, $route, $location, AuthService) {

    setNewLocaleForMoment();
    function setNewLocaleForMoment(){
        console.log('creating new locale');
        moment.defineLocale( 'bt-v2', {
            months : 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split('_'),
            monthsShort : 'Jan_Fév_Mar_Avr_Mai_Juin_Juil_Août_Sept_Oct_Nov_Déc'.split('_'),
            monthsParseExact : true,
            weekdays : 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
            weekdaysShort : 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
            weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
            weekdaysParseExact : true,
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'HH:mm:ss',
                L : 'YYYY-MM-DD',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY HH:mm',
                LLLL : 'dddd D MMMM YYYY [à] HH:mm'
            },
            calendar : {
                sameDay : '[Aujourd’hui à] LT',
                nextDay : '[Demain à] LT',
                nextWeek : 'dddd [à] LT',
                lastDay : '[Hier à] LT',
                lastWeek : 'dddd [dernier à] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'dans %s',
                past : 'il y a %s',
                s : 'quelques secondes',
                m : 'une minute',
                mm : '%d minutes',
                h : 'une heure',
                hh : '%d heures',
                d : 'un jour',
                dd : '%d jours',
                M : 'un mois',
                MM : '%d mois',
                y : 'un an',
                yy : '%d ans'
            },
            dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
            ordinal : function (number, period) {
                switch (period) {
                    // Words with masculine grammatical gender: mois, trimestre, jour
                    default:
                    case 'M':
                    case 'Q':
                    case 'D':
                    case 'DDD':
                    case 'd':
                        return number + (number === 1 ? 'er' : 'e');

                    // Words with feminine grammatical gender: semaine
                    case 'w':
                    case 'W':
                        return number + (number === 1 ? 're' : 'e');
                }
            }
        });
    }

});

// this code is run whenever a page changes and it checks for authorization.
// if not authorized, redirect to login page.
app.run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {
        $rootScope.$on('$routeChangeStart', function (event, newUrl, currentUrl) {
        if (newUrl.requireAuth && !AuthService.isLoggedIn()) {
            event.preventDefault();
            $location.path("/login");
        }
  });
}]);

app.directive("navBar", function() {
    return {
        restrict: "E",
        templateUrl: "./app/views/navbar.html",
        controller: "NavbarController"
        //link: function($scope, element, attrs) {} //DOM manipulation
    };
});

app.directive('modalDialog',function(){      
    return {
        restrict: 'E', 
        templateUrl : './app/views/modal.html'
    }   
});

app.constant("BTCONFIGS", {
    backendHost: "http://localhost:3000/",
    backendHost2: "",
    isDev: false,
    noLogging: false
});
