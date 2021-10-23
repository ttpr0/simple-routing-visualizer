using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    /// <summary>
    /// basic birectional Djkstra algorithm
    /// </summary>
    class BidirectDjkstra : IShortestPath
    {
        private SortedDictionary<double, GraphNode> visited_start;
        private SortedDictionary<double, GraphNode> visited_end;
        private GraphNode midnode;
        private GraphNode startnode;
        private GraphNode endnode;

        public BidirectDjkstra(GraphNode start, GraphNode end)
        {
            this.startnode = start;
            this.endnode = end;
            this.visited_start = new SortedDictionary<double, GraphNode>();
            this.visited_start.Add(0, startnode);
            this.visited_end = new SortedDictionary<double, GraphNode>();
            this.visited_end.Add(0, endnode);
            this.startnode.data.pathlength = 0;
            this.endnode.data.pathlength2 = 0;
        }

        private GraphNode currnode_start;
        private double currkey_start;
        private GraphNode currnode_end;
        private double currkey_end;
        /// <summary>
        /// performs one step of algorithm (one step from each direction)
        /// </summary>
        /// <returns>false if shortest path found</returns>
        public bool step()
        {
            currkey_start = visited_start.Keys.First();
            currnode_start = visited_start[currkey_start];
            if (currnode_start.isVisited())
            {
                this.midnode = currnode_start;
                return false;
            }
            foreach (GraphEdge way in currnode_start.getEdges())
            {
                if (way.isVisited())
                {
                    continue;
                }
                if (way.data.oneway)
                {
                    if (way.getNodeB().getID() == currnode_start.getID())
                    {
                        continue;
                    }
                }
                way.setVisited(true);
                double newlength = currkey_start + way.getWeight();
                GraphNode othernode = way.getOtherNode(currnode_start);
                if (othernode.data.pathlength > newlength)
                {
                    if (othernode.data.pathlength != 1000000)
                    {
                        visited_start.Remove(othernode.data.pathlength);
                    }
                    othernode.data.prevEdge = way;
                    newlength = addToVisited(newlength, othernode, true);
                    othernode.data.pathlength = newlength;
                }
            }
            currnode_start.setVisited(true);
            visited_start.Remove(currkey_start);

            currkey_end = visited_end.Keys.First();
            currnode_end = visited_end[currkey_end];
            if (currnode_end.isVisited())
            {
                this.midnode = currnode_end;
                return false;
            }
            foreach (GraphEdge way in currnode_end.getEdges())
            {
                if (way.isVisited())
                {
                    continue;
                }
                if (way.data.oneway)
                {
                    if (way.getNodeA().getID() == currnode_end.getID())
                    {
                        continue;
                    }
                }
                way.setVisited(true);
                double newlength = currkey_end + way.getWeight();
                GraphNode othernode = way.getOtherNode(currnode_end);
                if (othernode.data.pathlength2 > newlength)
                {
                    if (othernode.data.pathlength2 != 1000000)
                    {
                        visited_end.Remove(othernode.data.pathlength2);
                    }
                    othernode.data.prevEdge2 = way;
                    newlength = addToVisited(newlength, othernode, false);
                    othernode.data.pathlength2 = newlength;
                }
            }
            currnode_end.setVisited(true);
            visited_end.Remove(currkey_end);
            return true;
        }

        /// <summary>
        /// function to avoid similar entries in dict
        /// </summary>
        /// <param name="newkey">key/pathlength of visited node</param>
        /// <param name="newnode">visited node</param>
        /// <param name="start">true if direction from start</param>
        /// <returns>entry to dict, might differ from newkey param</returns>
        private double addToVisited(double newkey, GraphNode newnode, bool start)
        {
            try
            {
                if (start)
                {
                    visited_start.Add(newkey, newnode);
                }
                else
                {
                    visited_end.Add(newkey, newnode);
                }
                return newkey;
            }
            catch (Exception)
            {
                return addToVisited(newkey + 0.00001, newnode, start);
            }
        }

        /// <summary>
        /// use only after path finsing finished
        /// </summary>
        /// <returns>list of LineD representing shortest path</returns>
        public List<LineD> getShortestPath()
        {
            List<LineD> waylist = new List<LineD>();
            GraphEdge curredge;
            currnode_start = midnode;
            while (true)
            {
                if (currnode_start == startnode)
                {
                    break;
                }
                curredge = (GraphEdge)currnode_start.data.prevEdge;
                waylist.Add(curredge.getGeometry());
                currnode_start = curredge.getOtherNode(currnode_start);
            }
            currnode_end = midnode;
            while (true)
            {
                if (currnode_end == endnode)
                {
                    break;
                }
                curredge = (GraphEdge)currnode_end.data.prevEdge2;
                waylist.Add(curredge.getGeometry());
                currnode_end = curredge.getOtherNode(currnode_end);
            }
            return waylist;
        }
    }
}
