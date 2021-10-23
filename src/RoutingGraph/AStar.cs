using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    /// <summary>
    /// basic implementation of A* algorithm
    /// </summary>
    class AStar : IShortestPath
    {
        private SortedDictionary<double, GraphNode> visited;
        private GraphNode endnode;
        private GraphNode startnode;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="start">startnode</param>
        /// <param name="end">endnode</param>
        public AStar(GraphNode start, GraphNode end)
        {
            this.endnode = end;
            this.startnode = start;
            this.visited = new SortedDictionary<double, GraphNode>();
            this.visited.Add(0, startnode);
            startnode.data.pathlength = 0;
        }

        private GraphNode currnode;
        private double currkey;
        /// <summary>
        /// performs one step of A* algorithm,
        /// sets visited GraphEdges to visited
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
            foreach (GraphEdge way in currnode.getEdges())
            {
                if (way.isVisited())
                {
                    continue;
                }
                if (way.data.oneway)
                {
                    if (way.getNodeB().getID() == currnode.getID())
                    {
                        continue;
                    }
                }
                way.setVisited(true);
                GraphNode othernode = way.getOtherNode(currnode);
                othernode.data.distance = GraphUtils.getDistance(othernode, endnode);
                double newlength = currnode.data.pathlength - currnode.data.distance + way.getWeight() + othernode.data.distance;
                if (othernode.data.pathlength > newlength)
                {
                    if (othernode.data.pathlength < 1000000)
                    {
                        visited.Remove(othernode.data.pathlength);
                    }
                    othernode.data.prevEdge = way;
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
        private double addToVisited(double newkey, GraphNode newnode)
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
            GraphEdge curredge;
            while (true)
            {
                if (currnode == startnode)
                {
                    break;
                }
                curredge = (GraphEdge)currnode.data.prevEdge;
                waylist.Add(curredge.getGeometry());
                currnode = curredge.getOtherNode(currnode);
            }
            return waylist;
        }
    }
}
