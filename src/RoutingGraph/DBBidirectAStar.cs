using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    /// <summary>
    /// not finished jet
    /// </summary>
    [Obsolete]
    class DBBidirectAStar : IShortestPath
    {
        private DBGraph graph;

        private SortedDictionary<double, DBGraphNode> visited_start;
        private SortedDictionary<double, DBGraphNode> visited_end;
        private DBGraphNode startnode;
        private DBGraphNode endnode;
        private DBGraphNode midnode;

        public DBBidirectAStar(GraphNode start, GraphNode end)
        {
            this.graph = new DBGraph("data/graph.db");
            this.startnode = this.graph.getGraphNodeByID(start.getID());
            this.endnode = this.graph.getGraphNodeByID(end.getID());
            this.visited_start = new SortedDictionary<double, DBGraphNode>();
            this.visited_start.Add(0, startnode);
            this.visited_end = new SortedDictionary<double, DBGraphNode>();
            this.visited_end.Add(0, endnode);
            startnode.data.distance = GraphUtils.getDistance(startnode, endnode);
            startnode.data.distance2 = 0;
            startnode.data.pathlength = 0;
            endnode.data.distance = 0;
            endnode.data.distance2 = GraphUtils.getDistance(endnode, startnode);
            endnode.data.pathlength2 = 0;
            endnode.setVisited(true);
        }

        private bool finished;
        /// <summary>
        /// performs bidirectional A*
        /// </summary>
        /// <returns>false</returns>
        public bool step()
        {
            this.finished = false;
            var task1 = Task.Run(() =>
            {
                this.fromStart();
            });
            var task2 = Task.Run(() =>
            {
                this.fromEnd();
            });
            Task.WaitAll(task1, task2);
            return false;
        }

        /// <summary>
        /// A* from startnode
        /// </summary>
        private void fromStart()
        {
            DBGraphNode currnode;
            double currkey;
            while (!this.finished)
            {
                currkey = visited_start.Keys.First();
                currnode = visited_start[currkey];
                if (currnode.isVisited())
                {
                    this.midnode = currnode;
                    this.finished = true;
                    return;
                }
                foreach (DBGraphEdge edge in this.graph.getAdjacentEdges(currnode))
                {
                    if (edge.isVisited())
                    {
                        continue;
                    }
                    if (edge.data.oneway)
                    {
                        if (edge.getNodeB() == currnode)
                        {
                            continue;
                        }
                    }
                    if (currnode.data.distance2 > 1000 && !edge.data.important)
                    {
                        continue;
                    }
                    edge.setVisited(true);
                    DBGraphNode othernode = edge.getOtherNode(currnode);
                    othernode.data.distance = GraphUtils.getDistance(othernode, endnode);
                    othernode.data.distance2 = GraphUtils.getDistance(othernode, startnode);
                    double newlength = currnode.data.pathlength - currnode.data.distance + edge.getWeight() + othernode.data.distance;
                    if (othernode.data.pathlength > newlength)
                    {
                        if (othernode.data.pathlength < 1000000)
                        {
                            visited_start.Remove(othernode.data.pathlength);
                        }
                        othernode.data.prevEdge = edge;
                        newlength = addToVisitedStart(newlength, othernode);
                        othernode.data.pathlength = newlength;
                    }
                }
                currnode.setVisited(true);
                visited_start.Remove(currkey);
            }
        }

        /// <summary>
        /// A* from endnode
        /// </summary>
        private void fromEnd()
        {
            DBGraphNode currnode;
            double currkey;
            while (!this.finished)
            {
                currkey = visited_end.Keys.First();
                currnode = visited_end[currkey];
                if (currnode.isVisited())
                {
                    this.midnode = currnode;
                    this.finished = true;
                    return;
                }
                foreach (DBGraphEdge edge in this.graph.getAdjacentEdges(currnode))
                {
                    if (edge.isVisited())
                    {
                        continue;
                    }
                    if (edge.data.oneway)
                    {
                        if (edge.getNodeA() == currnode)
                        {
                            continue;
                        }
                    }
                    if (currnode.data.distance > 1000 && !edge.data.important)
                    {
                        continue;
                    }
                    edge.setVisited(true);
                    DBGraphNode othernode = edge.getOtherNode(currnode);
                    othernode.data.distance = GraphUtils.getDistance(othernode, endnode);
                    othernode.data.distance2 = GraphUtils.getDistance(othernode, startnode);
                    double newlength = currnode.data.pathlength2 - currnode.data.distance2 + edge.getWeight() + othernode.data.distance2;
                    if (othernode.data.pathlength2 > newlength)
                    {
                        if (othernode.data.pathlength2 < 1000000)
                        {
                            visited_end.Remove(othernode.data.pathlength2);
                        }
                        othernode.data.prevEdge2 = edge;
                        newlength = addToVisitedEnd(newlength, othernode);
                        othernode.data.pathlength2 = newlength;
                    }
                }
                currnode.setVisited(true);
                visited_end.Remove(currkey);
            }
        }

        /// <summary>
        /// function to avoid similar entries in dict,
        /// adds newnode to start-dict
        /// </summary>
        /// <param name="newkey">key/pathlength of visited node</param>
        /// <param name="newnode">visited node</param>
        /// <returns>entry to dict, might differ from newkey param</returns>
        private double addToVisitedStart(double newkey, DBGraphNode newnode)
        {
            try
            {
                visited_start.Add(newkey, newnode);
                return newkey;
            }
            catch (Exception)
            {
                return addToVisitedStart(newkey + 0.00001, newnode);
            }
        }

        /// <summary>
        /// function to avoid similar entries in dict,
        /// adds newnode to end-dict
        /// </summary>
        /// <param name="newkey">key/pathlength of visited node</param>
        /// <param name="newnode">visited node</param>
        /// <returns>entry to dict, might differ from newkey param</returns>
        private double addToVisitedEnd(double newkey, DBGraphNode newnode)
        {
            try
            {
                visited_end.Add(newkey, newnode);
                return newkey;
            }
            catch (Exception)
            {
                return addToVisitedEnd(newkey + 0.00001, newnode);
            }
        }

        /// <summary>
        /// use only after path finsing finished
        /// </summary>
        /// <returns>list of LineD representing shortest path</returns>
        public List<LineD> getShortestPath()
        {
            List<LineD> waylist = new List<LineD>();
            DBGraphEdge curredge;
            DBGraphNode currnode_start = midnode;
            while (true)
            {
                if (currnode_start == startnode)
                {
                    break;
                }
                curredge = (DBGraphEdge)currnode_start.data.prevEdge;
                waylist.Add(curredge.getGeometry());
                currnode_start = curredge.getOtherNode(currnode_start);
            }
            DBGraphNode currnode_end = midnode;
            while (true)
            {
                if (currnode_end == endnode)
                {
                    break;
                }
                curredge = (DBGraphEdge)currnode_end.data.prevEdge2;
                waylist.Add(curredge.getGeometry());
                currnode_end = curredge.getOtherNode(currnode_end);
            }
            return waylist;
        }
    }
}
