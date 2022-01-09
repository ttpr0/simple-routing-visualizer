using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.Routing.Graph;
using Simple.GeoData;

namespace Simple.Routing.ShortestPath
{
    /// <summary>
    /// basic bidirectional A* algorithm
    /// </summary>
    class BidirectAStar : IShortestPath
    {
        private SortedDictionary<double, BasicNode> visited_start;
        private SortedDictionary<double, BasicNode> visited_end;
        private BasicNode startnode;
        private BasicNode endnode;
        private BasicNode midnode;
        private BasicGraph graph;

        public BidirectAStar(BasicGraph graph, int start, int end)
        {
            this.graph = graph;
            this.startnode = graph.getNode(start);
            this.endnode = graph.getNode(end);
            this.visited_start = new SortedDictionary<double, BasicNode>();
            this.visited_start.Add(0, startnode);
            this.visited_end = new SortedDictionary<double, BasicNode>();
            this.visited_end.Add(0, endnode);
            startnode.data.pathlength = 0;
            endnode.data.pathlength2 = 0;
        }

        private BasicNode currnode_start;
        private double currkey_start;
        private BasicNode currnode_end;
        private double currkey_end;
        /// <summary>
        /// performs one step of algorithm (one step from each direction)
        /// </summary>
        /// <returns>false if shortest path found</returns>
        public bool calcShortestPath()
        {
            while (true)
            {
                try
                {
                    currkey_start = visited_start.Keys.First();
                    currnode_start = visited_start[currkey_start];
                }
                catch (Exception)
                {
                    return false;
                }
                if (currnode_start.isVisited())
                {
                    this.midnode = currnode_start;
                    return true;
                }
                foreach (BasicEdge edge in this.graph.getAdjacentEdges(currnode_start))
                {
                    if (edge.isVisited())
                    {
                        continue;
                    }
                    if (edge.data.oneway)
                    {
                        if (edge.getNodeB() == currnode_start.getID())
                        {
                            continue;
                        }
                    }
                    edge.setVisited(true);
                    BasicNode othernode = this.graph.getNode(edge.getOtherNode(currnode_start.getID()));
                    othernode.data.distance = Distance.euclideanDistance(othernode.point, endnode.point);
                    double newlength = currnode_start.data.pathlength - currnode_start.data.distance + edge.getWeight() + othernode.data.distance;
                    if (othernode.data.pathlength > newlength)
                    {
                        if (othernode.data.pathlength < 1000000000)
                        {
                            visited_start.Remove(othernode.data.pathlength);
                        }
                        othernode.data.prevEdge = edge;
                        newlength = addToVisited(newlength, othernode, true);
                        othernode.data.pathlength = newlength;
                    }
                }
                currnode_start.setVisited(true);
                visited_start.Remove(currkey_start);

                try
                {
                    currkey_end = visited_end.Keys.First();
                    currnode_end = visited_end[currkey_end];
                }
                catch (Exception)
                {
                    return false;
                }
                if (currnode_end.isVisited())
                {
                    this.midnode = currnode_end;
                    return false;
                }
                foreach (BasicEdge edge in this.graph.getAdjacentEdges(currnode_end))
                {
                    if (edge.isVisited())
                    {
                        continue;
                    }
                    if (edge.data.oneway)
                    {
                        if (edge.getNodeA() == currnode_end.getID())
                        {
                            continue;
                        }
                    }
                    edge.setVisited(true);
                    BasicNode othernode = this.graph.getNode(edge.getOtherNode(currnode_end.getID()));
                    othernode.data.distance2 = Distance.euclideanDistance(othernode.point, startnode.point);
                    double newlength = currnode_end.data.pathlength2 - currnode_end.data.distance2 + edge.getWeight() + othernode.data.distance2;
                    if (othernode.data.pathlength2 > newlength)
                    {
                        if (othernode.data.pathlength2 < 1000000000)
                        {
                            visited_end.Remove(othernode.data.pathlength2);
                        }
                        othernode.data.prevEdge2 = edge;
                        newlength = addToVisited(newlength, othernode, false);
                        othernode.data.pathlength2 = newlength;
                    }
                }
                currnode_end.setVisited(true);
                visited_end.Remove(currkey_end);
            }
        }

        public bool steps(int count, List<LineD> visitededges)
        {
            for (int i = 0; i < count; i++)
            {
                currkey_start = visited_start.Keys.First();
                currnode_start = visited_start[currkey_start];
                if (currnode_start.isVisited())
                {
                    this.midnode = currnode_start;
                    return false;
                }
                foreach (BasicEdge edge in this.graph.getAdjacentEdges(currnode_start))
                {
                    if (edge.isVisited())
                    {
                        continue;
                    }
                    if (edge.data.oneway)
                    {
                        if (edge.getNodeB() == currnode_start.getID())
                        {
                            continue;
                        }
                    }
                    edge.setVisited(true);
                    visitededges.Add(edge.getGeometry());
                    BasicNode othernode = this.graph.getNode(edge.getOtherNode(currnode_start.getID()));
                    othernode.data.distance = Distance.euclideanDistance(othernode.point, endnode.point);
                    double newlength = currnode_start.data.pathlength - currnode_start.data.distance + edge.getWeight() + othernode.data.distance;
                    if (othernode.data.pathlength > newlength)
                    {
                        if (othernode.data.pathlength < 1000000000)
                        {
                            visited_start.Remove(othernode.data.pathlength);
                        }
                        othernode.data.prevEdge = edge;
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
                foreach (BasicEdge edge in this.graph.getAdjacentEdges(currnode_end))
                {
                    if (edge.isVisited())
                    {
                        continue;
                    }
                    if (edge.data.oneway)
                    {
                        if (edge.getNodeA() == currnode_end.getID())
                        {
                            continue;
                        }
                    }
                    edge.setVisited(true);
                    visitededges.Add(edge.getGeometry());
                    BasicNode othernode = this.graph.getNode(edge.getOtherNode(currnode_end.getID()));
                    othernode.data.distance2 = Distance.euclideanDistance(othernode.point, startnode.point);
                    double newlength = currnode_end.data.pathlength2 - currnode_end.data.distance2 + edge.getWeight() + othernode.data.distance2;
                    if (othernode.data.pathlength2 > newlength)
                    {
                        if (othernode.data.pathlength2 < 1000000000)
                        {
                            visited_end.Remove(othernode.data.pathlength2);
                        }
                        othernode.data.prevEdge2 = edge;
                        newlength = addToVisited(newlength, othernode, false);
                        othernode.data.pathlength2 = newlength;
                    }
                }
                currnode_end.setVisited(true);
                visited_end.Remove(currkey_end);
            }
            return true;
        }

        /// <summary>
        /// function to avoid similar entries in dict
        /// </summary>
        /// <param name="newkey">key/pathlength of visited node</param>
        /// <param name="newnode">visited node</param>
        /// <param name="start">true if direction from start</param>
        /// <returns>entry to dict, might differ from newkey param</returns>
        private double addToVisited(double newkey, BasicNode newnode, bool start)
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
        public Path getShortestPath()
        {
            List<LineD> geometry = new List<LineD>();
            List<int> edges = new List<int>();
            BasicEdge curredge;
            currnode_start = midnode;
            while (true)
            {
                if (currnode_start == startnode)
                {
                    break;
                }
                curredge = (BasicEdge)currnode_start.data.prevEdge;
                geometry.Add(curredge.getGeometry());
                currnode_start = this.graph.getNode(curredge.getOtherNode(currnode_start.getID()));
            }
            currnode_end = midnode;
            while (true)
            {
                if (currnode_end == endnode)
                {
                    break;
                }
                curredge = (BasicEdge)currnode_end.data.prevEdge2;
                geometry.Add(curredge.getGeometry());
                currnode_end = this.graph.getNode(curredge.getOtherNode(currnode_end.getID()));
            }
            return new Path(edges, geometry);
        }
    }
}
