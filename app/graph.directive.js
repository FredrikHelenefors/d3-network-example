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
                simulationParams: '<'
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

            d3.json('/assets/miserables.json', function(error, graph) {
                if (error) throw error;

                var link = svg.append('g')
                    .attr('class', 'links')
                    .selectAll('line')
                    .data(graph.links)
                    .enter().append('line')
                    .attr('stroke-width', function(d) { return Math.sqrt(d.value); });

                var node = svg.append('g')
                    .attr('class', 'nodes')
                    .selectAll('circle')
                    .data(graph.nodes)
                    .enter().append('circle')
                    .attr('r', 5)
                    .attr('fill', function(d) { return color(d.group); })
                    .call(d3.drag()
                        .on('start', dragstarted)
                        .on('drag', dragged)
                        .on('end', dragended));

                node.append('title')
                    .text(function(d) { return d.id; });

                simulation
                    .nodes(graph.nodes)
                    .on('tick', ticked);

                simulation.force('link')
                    .links(graph.links);

                var timeoutId = null;
                scope.$watchCollection('simulationParams', function(newVal, oldVal) {
                    $timeout.cancel(timeoutId);

                    timeoutId = $timeout(function() {
                        simulation
                            .force('link', d3.forceLink().id(function(d) { return d.id; }).distance(newVal.lineDistance))
                            .force('charge', d3.forceManyBody())
                            .force('center', d3.forceCenter(width / 2, height / 2));

                        node.append('title')
                            .text(function(d) { return d.id; });

                        simulation
                            .force('link')
                            .links(graph.links);

                        // Should set the alphaTarget back to 0 somehow
                        simulation.alphaTarget(0.3).restart();
                    }, 500);
                });

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