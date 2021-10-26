using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;

namespace RoutingVisualizer.NavigationGraph
{
    class BasicAStar : IShortestPath
    {
        private SortedDictionary<double, int> visited_start;
        private SortedDictionary<double, int> visited_end;
        private BasicNode startnode;
        private BasicNode endnode;
        private int startid;
        private int endid;
        private int midid;
        private BasicGraph graph;

        public BasicAStar(BasicGraph graph, int start, int end)
        {
            this.graph = graph;
            this.startid = start;
            this.endid = end;
            this.startnode = this.graph.getNode(startid);
            this.endnode = this.graph.getNode(endid);
            this.visited_start = new SortedDictionary<double, int>();
            this.visited_start.Add(0, startid);
            this.visited_end = new SortedDictionary<double, int>();
            this.visited_end.Add(0, endid);
            startnode.data.distance = GraphUtils.getDistance(startnode, endnode);
            startnode.data.distance2 = 0;
            startnode.data.pathlength = 0;
            endnode.data.distance = 0;
            endnode.data.distance2 = GraphUtils.getDistance(endnode, startnode);
            endnode.data.pathlength2 = 0;
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
            BasicNode currnode;
            double currkey;
            while (!this.finished)
            {
                currkey = visited_start.Keys.First();
                currnode = this.graph.getNode(visited_start[currkey]);
                if (currnode.isVisited())
                {
                    this.midid = currnode.getID();
                    this.finished = true;
                    return;
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
                    if (currnode.data.distance2 > 1000 && !edge.data.important)
                    {
                        continue;
                    }
                    edge.setVisited(true);
                    BasicNode othernode = this.graph.getNode(edge.getOtherNode(currnode.getID()));
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
            BasicNode currnode;
            double currkey;
            while (!this.finished)
            {
                currkey = visited_end.Keys.First();
                currnode = this.graph.getNode(visited_end[currkey]);
                if (currnode.isVisited())
                {
                    this.midid = currnode.getID();
                    this.finished = true;
                    return;
                }
                foreach (BasicEdge edge in this.graph.getAdjacentEdges(currnode))
                {
                    if (edge.isVisited())
                    {
                        continue;
                    }
                    if (edge.data.oneway)
                    {
                        if (edge.getNodeA() == currnode.getID())
                        {
                            continue;
                        }
                    }
                    if (currnode.data.distance > 1000 && !edge.data.important)
                    {
                        continue;
                    }
                    edge.setVisited(true);
                    BasicNode othernode = this.graph.getNode(edge.getOtherNode(currnode.getID()));
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
        private double addToVisitedStart(double newkey, BasicNode newnode)
        {
            try
            {
                visited_start.Add(newkey, newnode.getID());
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
        private double addToVisitedEnd(double newkey, BasicNode newnode)
        {
            try
            {
                visited_end.Add(newkey, newnode.getID());
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
            SqliteConnection conn = new SqliteConnection("Data Source=data/graph.db");
            conn.Open();
            SqliteCommand cmd = conn.CreateCommand();

            List<LineD> waylist = new List<LineD>();
            BasicNode currnode = this.graph.getNode(midid);
            BasicEdge curredge;
            while (true)
            {
                if (currnode == startnode)
                {
                    break;
                }
                curredge = (BasicEdge)currnode.data.prevEdge;
                cmd.CommandText = $"SELECT * FROM edges WHERE id={curredge.getID()};";
                var reader = cmd.ExecuteReader();
                reader.Read();
                string[] substrings = ((string)reader["geometry"]).Split("&&");
                List<PointD> points = new List<PointD>();
                foreach (string s in substrings)
                {
                    if (s == "")
                    {
                        continue;
                    }
                    string[] values = s.Split(";");
                    points.Add(new PointD(Convert.ToDouble(values[0]), Convert.ToDouble(values[1])));
                }
                reader.Close();
                waylist.Add(new LineD(points.ToArray()));
                currnode = this.graph.getNode(curredge.getOtherNode(currnode.getID()));
            }
            currnode = this.graph.getNode(midid);
            while (true)
            {
                if (currnode == endnode)
                {
                    break;
                }
                curredge = (BasicEdge)currnode.data.prevEdge2;
                cmd.CommandText = $"SELECT * FROM edges WHERE id={curredge.getID()};";
                var reader = cmd.ExecuteReader();
                reader.Read();
                string[] substrings = ((string)reader["geometry"]).Split("&&");
                List<PointD> points = new List<PointD>();
                foreach (string s in substrings)
                {
                    if (s == "")
                    {
                        continue;
                    }
                    string[] values = s.Split(";");
                    points.Add(new PointD(Convert.ToDouble(values[0]), Convert.ToDouble(values[1])));
                }
                reader.Close();
                waylist.Add(new LineD(points.ToArray()));
                currnode = this.graph.getNode(curredge.getOtherNode(currnode.getID()));
            }
            return waylist;
        }
    }
}
