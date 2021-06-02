(function() {

  "use strict";

  var app = angular.module('scheduler-web', ['ngMaterial', 'ui.router']);
    
    app.factory( "apiService", function(){
        return { url : "http://localhost:4000"};
    });
    
    app.config(function($mdThemingProvider, $stateProvider, $urlRouterProvider) {

      $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('orange');

      $urlRouterProvider.otherwise('/schedules');

      $stateProvider
        .state('schedules', {
          url: '/schedules',
          templateUrl: 'components/schedule/scheduler.view.html',
          controller: 'schedulerController as vm'
        });
    });
    
})();

