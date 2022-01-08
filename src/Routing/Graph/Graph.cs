using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    /// <summary>
    /// graph class
    /// </summary>
    class Graph
    {
        GraphEdge[] edges;
        GraphNode[] nodes;

        /// <summary>
        /// Constructor, connections between nodes and edges should be there allready
        /// </summary>
        /// <param name="nodes"></param>
        /// <param name="ways"></param>
        public Graph(GraphNode[] nodes, GraphEdge[] ways)
        {
            this.nodes = nodes;
            this.edges = ways;
            initGraph();
        }

        public GraphNode[] getGraphNodes()
        {
            return this.nodes;
        }

        public GraphEdge[] getGraphEdges()
        {
            return this.edges;
        }

        public GraphNode getNodeById(int id)
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

        public GraphEdge getEdgeById(int id)
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

        /// <summary>
        /// resets most attributes of nodes and edges to default
        /// </summary>
        public void initGraph()
        {
            foreach (GraphNode node in nodes)
            {
                node.setVisited(false);
                node.data.pathlength = 1000000000;
                node.data.pathlength2 = 1000000000;
            }
            foreach (GraphEdge edge in edges)
            {
                edge.setVisited(false);
            }
        }
    }
}
