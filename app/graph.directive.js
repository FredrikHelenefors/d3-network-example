(function() {
    'use strict';

    angular
        .module('heGraph')
        .directive('heGraph', GraphDirective);

    GraphDirective.$inject = ['$timeout'];
    function GraphDirective($timeout) {
        var directive = {
            link: link,
            scope: {
                simulationParams: '<',
                graphData: '<'
            }
        };

        return directive;

        function link(scope, element) {
            var svg = d3.select(element[0]),
                width = +svg.attr('width'),
                height = +svg.attr('height');

            var color = d3.scaleOrdinal(d3.schemeCategory20);

            var simulation = d3.forceSimulation()
                .force('link', d3.forceLink().id(function(d) { return d.id; }).distance(30))
                .force('charge', d3.forceManyBody())
                .force('center', d3.forceCenter(width / 2, height / 2));

            var node = null;
            var link = null;

            scope.$watchCollection('graphData', redraw);

            function redraw() {
                svg.selectAll('*').remove();

                link = svg.append('g')
                    .attr('class', 'links')
                    .selectAll('line')
                    .data(scope.graphData.links)
                    .enter().append('line')
                    .attr('stroke-width', function(d) { return Math.sqrt(d.value); });

                node = svg.append('g')
                    .attr('class', 'nodes')
                    .selectAll('circle')
                    .data(scope.graphData.nodes)
                    .enter().append('circle')
                    .attr('r', 5)
                    .attr('fill', function(d) { return color(d.group); })
                    .on('dblclick', function(event) {
                        scope.graphData.nodes.splice(event.index, 1);

                        // Remove links connected with that node
                        for (var i = scope.graphData.links.length - 1; i >= 0; i--) {
                            var item = scope.graphData.links[i];
                            console.log(item);

                            if (item.target.id === event.id || item.source.id === event.id) {
                                scope.graphData.links.splice(i, 1);
                            }
                        }

                        // TODO: After clearing the links, remove the single nodes without links
                        
                        redraw();
                    })
                    .call(d3.drag()
                        .on('start', dragstarted)
                        .on('drag', dragged)
                        .on('end', dragended));

                node.append('title')
                    .text(function(d) { return d.id; });

                simulation
                    .nodes(scope.graphData.nodes)
                    .on('tick', ticked);

                simulation.force('link')
                    .links(scope.graphData.links);
            }

            function ticked() {
                link
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });

                node
                    .attr('cx', function(d) { return d.x; })
                    .attr('cy', function(d) { return d.y; });
            }

            var timeoutId = null;
            scope.$watchCollection('simulationParams', function(newVal, oldVal) {
                $timeout.cancel(timeoutId);

                timeoutId = $timeout(function() {
                    simulation
                        .force('link', d3.forceLink().id(function(d) { return d.id; }).distance(newVal.lineDistance));

                    simulation
                        .force('link')
                        .links(scope.graphData.links);

                    // TODO: Should set the alphaTarget back to 0 somehow
                    simulation.alphaTarget(0.3).restart();
                }, 500);
            });

            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
        }
    }
}());