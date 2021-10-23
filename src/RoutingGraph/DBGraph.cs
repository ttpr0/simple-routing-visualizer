using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;

namespace RoutingVisualizer.NavigationGraph
{
    class DBGraph
    {
        private SortedDictionary<long, DBGraphNode> node_dict;
        private SqliteConnection conn;
        private SqliteCommand cmd;

        public DBGraph(string dbfile)
        {
            this.conn = new SqliteConnection("Data Source=" + dbfile);
            this.conn.Open();
            this.cmd = conn.CreateCommand();
            this.node_dict = new SortedDictionary<long, DBGraphNode>();
        }

        ~DBGraph()
        {
            conn.Close();
            node_dict.Clear();
        }

        public DBGraphNode getGraphNodeByID(long id)
        {
            DBGraphNode a;
            if (node_dict.ContainsKey(id))
            {
                a = node_dict[id];
            }
            else
            {
                a = loadGraphNode(id);
            }
            return a;
        }

        public List<DBGraphEdge> getAdjacentEdges(DBGraphNode node)
        {
            List<DBGraphEdge> edges = new List<DBGraphEdge>();
            foreach (long id in node.getEdges())
            {
                if (loadGraphEdge(id) == null)
                {
                    continue;
                }
                edges.Add(loadGraphEdge(id));
            }
            return edges;
        }

        private DBGraphNode loadGraphNode(long id)
        {
            this.cmd.CommandText = $"SELECT * FROM nodes WHERE id={id};";
            var reader = cmd.ExecuteReader();
            reader.Read();
            DBGraphNode node = new DBGraphNode(id, new PointD((double)reader["x"], (double)reader["y"]));
            string[] ways = ((string)reader["edges"]).Split("&&");
            foreach (string s in ways)
            {
                if (s == "")
                {
                    continue;
                }
                node.addGraphEdge(Convert.ToInt64(s));
            }
            node.data.pathlength = 1000000;
            node.data.pathlength2 = 1000000;
            node.setVisited(false);
            reader.Close();
            this.node_dict.Add(id, node);
            return node;
        }

        private DBGraphEdge loadGraphEdge(long id)
        {
            this.cmd.CommandText = $"SELECT * FROM edges WHERE id={id};";
            var reader = cmd.ExecuteReader();
            reader.Read();
            double weight = (double)reader["weight"];
            string type = (string)reader["type"];
            bool oneway = toBool(reader["oneway"]);
            long start = (long)reader["start"];
            long end = (long)reader["end"];
            reader.Close();
            DBGraphNode a = getGraphNodeByID(start);
            DBGraphNode b = getGraphNodeByID(end);
            DBGraphEdge edge = new DBGraphEdge(id, a, b, weight, type, oneway);
            return edge;
        }

        private bool toBool(object obj)
        {
            long i = Convert.ToInt64(obj);
            if (i == 0)
            {
                return false;
            }
            return true;
        }
    }
}
