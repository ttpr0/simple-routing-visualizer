using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    /// <summary>
    /// basic implementation of Djkstra algorithm
    /// </summary>
    class Djkstra : IShortestPath
    {
        private SortedDictionary<double, BasicNode> visited;
        private BasicNode endnode;
        private BasicNode startnode;
        private BasicGraph graph;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="start">startnode</param>
        /// <param name="end">endnode</param>
        public Djkstra(BasicGraph graph, int start, int end)
        {
            this.graph = graph;
            this.endnode = this.graph.getNode(end);
            this.startnode = this.graph.getNode(start);
            this.visited = new SortedDictionary<double, BasicNode>();
            this.visited.Add(0, startnode);
            this.startnode.data.pathlength = 0;
        }

        private BasicNode currnode;
        private double currkey;
        /// <summary>
        /// performs one step of Djkstra algorithm
        /// </summary>
        /// <returns>false if shortest path is found</returns>
        public bool step()
        {
            currkey = visited.Keys.First();
            currnode = visited[currkey];
            if (currnode == endnode)
            {
                return false;
            }
            foreach (BasicEdge edge in this.graph.getAdjacentEdges(currnode))
            {
                if (edge.isVisited())
                {
                    continue;
                }
                if (edge.data.oneway)
                {
                    if (edge.getNodeB() == currnode.getID())
                    {
                        continue;
                    }
                }
                edge.setVisited(true);
                double newlength = currkey + edge.data.weight;
                BasicNode othernode = this.graph.getNode(edge.getOtherNode(currnode.getID()));
                if (othernode.data.pathlength > newlength)
                {
                    if (othernode.data.pathlength < 1000000)
                    {
                        visited.Remove(othernode.data.pathlength);
                    }
                    othernode.data.prevEdge = edge;
                    newlength = addToVisited(newlength, othernode);
                    othernode.data.pathlength = newlength;
                }
            }
            visited.Remove(currkey);
            return true;
        }

        /// <summary>
        /// function to avoid similar entries in dict
        /// </summary>
        /// <param name="newkey">key/pathlength of visited node</param>
        /// <param name="newnode">visited node</param>
        /// <returns>entry to dict, might differ from newkey param</returns>
        private double addToVisited(double newkey, BasicNode newnode)
        {
            try
            {
                visited.Add(newkey, newnode);
                return newkey;
            }
            catch (Exception)
            {
                return addToVisited(newkey + 0.00001, newnode);
            }
        }

        /// <summary>
        /// use only after path finsing finished
        /// </summary>
        /// <returns>list of LineD representing shortest path</returns>
        public List<LineD> getShortestPath()
        {
            List<LineD> waylist = new List<LineD>();
            currnode = endnode;
            BasicEdge curredge;
            while (true)
            {
                if (currnode == startnode)
                {
                    break;
                }
                curredge = (BasicEdge)currnode.data.prevEdge;
                waylist.Add(curredge.getGeometry());
                currnode = this.graph.getNode(curredge.getOtherNode(currnode.getID()));
            }
            return waylist;
        }
    }
}
