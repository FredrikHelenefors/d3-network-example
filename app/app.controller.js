(function() {
    'use strict';

    angular
        .module('heGraph')
        .controller('GraphController', GraphController);

    GraphController.$inject = ['$http'];
    function GraphController($http) {
        var vm = this;

        vm.graphData = { nodes: [], links: [] };
        vm.groups = [];
        vm.characters = [];
        vm.newNode = { id: null, group: null };
        vm.newLink = { source: null, target: null, value: 1 };
        vm.newLinks = [{ value: 1 }];
        vm.simulationParams = { lineDistance: 30, lineStrength: .15, chargeStrength: -30 };
        vm.sectionsVisibility = { simulationParams: false, newNode: false, newLink: false };

        vm.addNode = addNode;
        vm.addLink = addLink;
        vm.removeLinkInputGroup = removeLinkInputGroup;
        vm.addLinkInputGroup = addLinkInputGroup;
        vm.manageSectionVisibility = manageSectionVisibility;

        activate();

        function activate() {
            fetchGraphData();
        }

        function fetchGraphData() {
            $http.get('../assets/miserables.json')
                .then(function(res) {
                    vm.graphData = res.data;
                    findAllGroups();
                    findAllCharacters();
                });
        }

        function findAllGroups() {
            vm.groups = [];

            vm.graphData.nodes.forEach(function(node) {
                if (vm.groups.indexOf(node.group) === -1) {
                    vm.groups.push(node.group);
                }
            });
        }

        function findAllCharacters() {
            vm.characters = [];

            vm.graphData.nodes.forEach(function(node) {
                if (vm.characters.indexOf(node.id) === -1) {
                    vm.characters.push(node.id);
                }
            });
        }

        function addNode() {
            // Check if the form has any errors
            if (vm.newNodeForm.$invalid) {
                return false;
            }

            // Create a temp data to add new node and links
            var tempGraphData = angular.copy(vm.graphData);

            tempGraphData.nodes.push(vm.newNode);
            vm.newLinks.forEach(function(link) {
                var newLink = {};

                if (link.direction === 'To') {
                    newLink.source = link.id;
                    newLink.target = vm.newNode.id;
                } else if (link.direction === 'From') {
                    newLink.target = link.id;
                    newLink.source = vm.newNode.id;
                }

                newLink.value = link.value;

                tempGraphData.links.push(newLink);
            });

            // Assigne the temp data to the real graph data to trigger redraw
            vm.graphData = tempGraphData;

            // Repopulate character select inputs
            findAllCharacters();

            // Reset inputs for this form
            vm.newNode = { id: null, group: null };
            vm.newLinks = [{ value: 1 }];
        }

        function addLink() {
            // Check if the form has any errors
            if (vm.newLinkForm.$invalid) {
                return false;
            }

            // Create a temp data to add new node and links
            var tempGraphData = angular.copy(vm.graphData);
            tempGraphData.links.push(vm.newLink);

            // Assigne the temp data to the real graph data to trigger redraw
            vm.graphData = tempGraphData;

            // Reset inputs for this form
            vm.newLink = { source: null, target: null, value: 1 };
        }

        function removeLinkInputGroup(index) {
            vm.newLinks.splice(index, 1);
        }

        function addLinkInputGroup() {
            vm.newLinks.push({ value: 1 });
        }

        function manageSectionVisibility(section) {
            vm.sectionsVisibility[section] = !vm.sectionsVisibility[section];
        }
    }
}());
