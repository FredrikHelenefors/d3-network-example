(function() {
    'use strict';

    angular
        .module('heGraph')
        .controller('GraphController', GraphController);

    GraphController.$inject = ['$http'];
    function GraphController($http) {
        var vm = this;

        vm.graphData = {
            nodes: [],
            links: []
        };
        vm.groups = [];
        vm.newNode = {
            id: null,
            group: null
        };
        vm.simulationParams = {
            lineDistance: 30
        };

        vm.addNode = addNode;

        activate();

        function activate() {
            fetchGraphData();
        }

        function fetchGraphData() {
            $http.get('../assets/miserables.json')
                .then(function(res) {
                    vm.graphData = res.data;
                    findAllGroups();
                });
        }

        function findAllGroups() {
            // TODO: Add Select to be default options
            vm.graphData.nodes.forEach(function(node) {
                if (vm.groups.indexOf(node.group) === -1) {
                    vm.groups.push(node.group);
                }
            });
        }

        function addNode() {
            if (vm.newNodeForm.$invalid) {
                return false;
            }

            var tempGraphData = angular.copy(vm.graphData);

            tempGraphData.nodes.push(vm.newNode);
            tempGraphData.links.push({source: vm.newNode.id, target: 'Myriel', value: 1});
            
            vm.graphData = tempGraphData;
        }
    }
}());
