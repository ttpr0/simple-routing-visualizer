using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Data.Sqlite;
using Simple.Routing.Graph;
using Simple.GeoData;

namespace Simple.Routing.ShortestPath
{
    class DBAStar
    {
        private DBGraph graph;

        private SortedDictionary<double, DBGraphNode> visited;
        private DBGraphNode endnode;
        private DBGraphNode startnode;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="start">startnode</param>
        /// <param name="end">endnode</param>
        public DBAStar(int start, int end)
        {
            this.graph = new DBGraph("data/graph.db");
            this.startnode = this.graph.getGraphNodeByID(start);
            this.endnode = this.graph.getGraphNodeByID(end);
            this.visited = new SortedDictionary<double, DBGraphNode>();
            this.visited.Add(0, startnode);
            startnode.data.pathlength = 0;
        }

        /// <summary>
        /// performs one step of A* algorithm,
        /// sets visited GraphEdges to visited
        /// </summary>
        /// <returns>false if shortest path is found</returns>
        public bool step()
        {
            DBGraphNode currnode;
            double currkey;
            while (true)
            {
                currkey = visited.Keys.First();
                currnode = visited[currkey];
                if (currnode == endnode)
                {
                    return false;
                }
                foreach (DBGraphEdge edge in this.graph.getAdjacentEdges(currnode))
                {
                    if (edge.isVisited())
                    {
                        continue;
                    }
                    if (edge.data.oneway)
                    {
                        if (edge.getNodeB().getID() == currnode.getID())
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
                    double newlength = currnode.data.pathlength - currnode.data.distance + edge.getWeight() + othernode.data.distance;
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
        }

        /// <summary>
        /// function to avoid similar entries in dict
        /// </summary>
        /// <param name="newkey">key/pathlength of visited node</param>
        /// <param name="newnode">visited node</param>
        /// <returns>entry to dict, might differ from newkey param</returns>
        private double addToVisited(double newkey, DBGraphNode newnode)
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
            SqliteConnection conn = new SqliteConnection("Data Source=data/graph.db");
            conn.Open();
            SqliteCommand cmd = conn.CreateCommand();

            List<LineD> waylist = new List<LineD>();
            DBGraphNode currnode = endnode;
            DBGraphEdge curredge;
            while (true)
            {
                if (currnode == startnode)
                {
                    break;
                }
                curredge = (DBGraphEdge)currnode.data.prevEdge;
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
                currnode = curredge.getOtherNode(currnode);
            }
            return waylist;
        }
    }
}
