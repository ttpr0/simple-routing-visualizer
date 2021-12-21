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
        Edge[] edges;
        Node[] nodes;

        /// <summary>
        /// Constructor, connections between nodes and edges should be there allready
        /// </summary>
        /// <param name="nodes"></param>
        /// <param name="ways"></param>
        public Graph(Node[] nodes, Edge[] ways)
        {
            this.nodes = nodes;
            this.edges = ways;
            initGraph();
        }

        public Node[] getGraphNodes()
        {
            return this.nodes;
        }

        public Edge[] getGraphEdges()
        {
            return this.edges;
        }

        public Node getNodeById(int id)
        {
            foreach (Node node in nodes)
            {
                if (node.getID() == id)
                {
                    return node;
                }
            }
            return null;
        }

        public Edge getEdgeById(int id)
        {
            foreach (Edge edge in edges)
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
            foreach (Node node in nodes)
            {
                node.setVisited(false);
                node.data.pathlength = 1000000000;
                node.data.pathlength2 = 1000000000;
            }
            foreach (Edge edge in edges)
            {
                edge.setVisited(false);
            }
        }
    }
}
