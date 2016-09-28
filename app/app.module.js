(function() {
    'use strict';

    angular
        .element(document)
        .ready(function() {
            angular.bootstrap(document, ['heGraph'], {
                strctDi: true
            });
        });

    angular
        .module('heGraph', ['ui.router'])
        .config(setConfig);

    setConfig.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider'];
    function setConfig($urlRouterProvider, $locationProvider, $stateProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/');

        // Root state of the application
        $stateProvider.state('app', {
            url: '/',
            controller: 'GraphController as vm',
            templateUrl: '/app/app.html'
        });
    }
}());