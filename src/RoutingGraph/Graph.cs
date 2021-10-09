using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    class Graph
    {
        List<GraphEdge> edges;
        List<GraphNode> nodes;

        public Graph(List<GraphNode> nodes, List<GraphEdge> ways)
        {
            this.nodes = nodes;
            this.edges = ways;
            initGraph();
        }

        public List<GraphNode> getGraphNodes()
        {
            return this.nodes;
        }

        public List<GraphEdge> getGraphEdges()
        {
            return this.edges;
        }

        public GraphNode getNodeById(long id)
        {
            foreach (GraphNode node in nodes)
            {
                if (node.getID() == id)
                {
                    return node;
                }
            }
            return null;
        }

        public GraphEdge getEdgeById(long id)
        {
            foreach (GraphEdge edge in edges)
            {
                if (edge.getID() == id)
                {
                    return edge;
                }
            }
            return null;
        }

        public void initGraph()
        {
            foreach (GraphNode node in nodes)
            {
                node.setVisited(false);
                node.data.pathlength = 1000000;
                node.data.pathlength2 = 1000000;
            }
            foreach (GraphEdge edge in edges)
            {
                edge.setVisited(false);
                edge.data.drawn = false;
            }
        }
    }
}
