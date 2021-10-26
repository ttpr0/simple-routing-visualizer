using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{ 
    class BasicGraph
    {
        BasicNode[] nodes;
        BasicEdge[] edges;

        public BasicGraph(BasicNode[] nodes, BasicEdge[] edges)
        {
            this.nodes = nodes;
            this.edges = edges;
        }

        public BasicNode getNode(int id)
        {
            return nodes[id];
        }

        public BasicEdge getEdge(int id)
        {
            return edges[id];
        }

        public List<BasicEdge> getAdjacentEdges(BasicNode node)
        {
            List<BasicEdge> edges = new List<BasicEdge>();
            foreach  (int edgeid in node.getEdges())
            {
                edges.Add(this.edges[edgeid]);
            }
            return edges;
        }

        public void initGraph()
        {
            foreach (BasicNode node in nodes)
            {
                node.setVisited(false);
                node.data.pathlength = 1000000;
                node.data.pathlength2 = 1000000;
            }
            foreach (BasicEdge edge in edges)
            {
                edge.setVisited(false);
                edge.data.drawn = false;
            }
        }
    }
}
