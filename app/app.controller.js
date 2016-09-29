(function() {
    'use strict';

    angular
        .module('heGraph')
        .controller('GraphController', GraphController);

    GraphController.$inject = [];
    function GraphController() {
        var vm = this;

        vm.simulationParams = {
            lineDistance: 30
        };
    }
}());
