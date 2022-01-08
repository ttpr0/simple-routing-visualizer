using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;
using System.IO;
using Microsoft.Data.Sqlite;
using System.Diagnostics;
using RoutingVisualizer;

namespace Simple.Routing.Graph
{
    /// <summary>
    /// static class, creates and returns different graph-objects
    /// </summary>
    class GraphFactory
    {
        /// <summary>
        /// instantiates BasicGraph from .graph file
        /// </summary>
        /// <param name="url">path to .graph file</param>
        /// <returns>BasicGraph object</returns>
        /// <exception cref="FileNotFoundException">thrown if file doesnt exist</exception>
        public BasicGraph loadBasicGraph(string url)
        {
            FileInfo f = new FileInfo(url);
            if (!f.Exists || f.Name.Split(".")[1] != "graph")
            {
                throw new FileNotFoundException("specified path doesnt meet requirements");
            }
            Byte[] data = File.ReadAllBytes(url);
            MemoryStream ms = new MemoryStream(data);
            BinaryReader br = new BinaryReader(ms);
            int nodecount = br.ReadInt32();
            BasicNode[] nodearr = new BasicNode[nodecount];
            for (int i = 0; i < nodecount; i++)
            {
                int id = i;
                double x = br.ReadDouble();
                double y = br.ReadDouble();
                int c = br.ReadInt32();
                int[] edges = new int[c];
                for (int j = 0; j < c; j++)
                {
                    edges[j] = br.ReadInt32();
                }
                BasicNode newnode = new BasicNode(id, new PointD(x, y), edges);
                nodearr[id] = newnode;
            }
            int edgecount = br.ReadInt32();
            BasicEdge[] edgearr = new BasicEdge[edgecount];
            for (int i = 0; i < edgecount; i++)
            {
                int id = i;
                int start = br.ReadInt32();
                int end = br.ReadInt32();
                double weight = br.ReadDouble();
                bool oneway = br.ReadBoolean();
                string type = "residential";
                List<PointD> points = new List<PointD>();
                int c = br.ReadInt32();
                for (int j = 0; j < c; j++)
                {
                    double x = br.ReadDouble();
                    double y = br.ReadDouble();
                    points.Add(new PointD(x, y));
                }
                BasicEdge newedge = new BasicEdge(id, new LineD(points.ToArray()), start, end, weight, type, oneway);
                edgearr[id] = newedge;
            }
            return new BasicGraph(nodearr, edgearr);
        }

        /// <summary>
        /// instantiates BasicGraph from .graph file (used only for development purposes)
        /// </summary>
        /// <param name="url">path to .graph file</param>
        /// <returns>BasicGraph object</returns>
        /// <exception cref="FileNotFoundException">thrown if file doesnt exist</exception>
        public BasicGraph loadBasicGraph2(string url)
        {
            FileInfo f = new FileInfo(url);
            if (!f.Exists || f.Name.Split(".")[1] != "graph")
            {
                throw new FileNotFoundException("specified path doesnt meet requirements");
            }
            int index = 0;
            Byte[] data = File.ReadAllBytes(url);
            int nodecount = BitConverter.ToInt32(data, index);
            index += 4;
            BasicNode[] nodearr = new BasicNode[nodecount];
            for (int i = 0; i < nodecount; i++)
            {
                int id = i;
                double x = BitConverter.ToDouble(data, index);
                index += 8;
                double y = BitConverter.ToDouble(data, index);
                index += 8;
                int c = BitConverter.ToInt32(data, index);
                index += 4;
                int[] edges = new int[c];
                for (int j = 0; j < c; j++)
                {
                    edges[j] = BitConverter.ToInt32(data, index);
                    index += 4;
                }
                BasicNode newnode = new BasicNode(id, new PointD(x, y), edges);
                nodearr[id] = newnode;
            }
            int edgecount = BitConverter.ToInt32(data, index);
            index += 4;
            BasicEdge[] edgearr = new BasicEdge[edgecount];
            for (int i = 0; i < edgecount; i++)
            {
                int id = i;
                int start = BitConverter.ToInt32(data, index);
                index += 4;
                int end = BitConverter.ToInt32(data, index);
                index += 4;
                double weight = BitConverter.ToDouble(data, index);
                index += 8;
                bool oneway = BitConverter.ToBoolean(data, index);
                index += 1;
                string type = "residential";
                List<PointD> points = new List<PointD>();
                int c = BitConverter.ToInt32(data, index);
                index += 4;
                for (int j = 0; j < c; j++)
                {
                    double x = BitConverter.ToDouble(data, index);
                    index += 8;
                    double y = BitConverter.ToDouble(data, index);
                    index += 8;
                    points.Add(new PointD(x, y));
                }
                BasicEdge newedge = new BasicEdge(id, new LineD(points.ToArray()), start, end, weight, type, oneway);
                edgearr[id] = newedge;
            }
            return new BasicGraph(nodearr, edgearr);
        }

        [Obsolete]
        public BasicGraph loadBasicGraphfromDB(string url)
        {
            FileInfo f = new FileInfo(url);
            string ftype = f.Name.Split(".")[1];
            if (!f.Exists || (ftype != "db" && ftype != "sqlite"))
            {
                throw new FileNotFoundException("specified path doesnt meet requirements");
            }
            SqliteConnection conn = new SqliteConnection("Data Source=" + url);
            conn.Open();
            SqliteCommand cmd = conn.CreateCommand();
            //List<GraphNode> nodedict = new SortedDictionary<long, GraphNode>();
            BasicNode[] nodearr = new BasicNode[383830];
            cmd.CommandText = $"SELECT * FROM nodes";
            var reader = cmd.ExecuteReader();
            int i = 0;
            while (reader.Read())
            {
                i++;
                int id = Convert.ToInt32(reader["id"]);
                double x = (double)reader["x"];
                double y = (double)reader["y"];
                List<int> edges = new List<int>();
                string[] substrings = ((string)reader["edges"]).Split("&&");
                foreach (string s in substrings)
                {
                    if (s == "")
                    {
                        continue;
                    }
                    edges.Add(Convert.ToInt32(s));
                }
                BasicNode newnode = new BasicNode(id, new PointD(x, y), edges.ToArray());
                nodearr[id] = newnode;
            }
            reader.Close();
            BasicEdge[] edgearr = new BasicEdge[455407];
            cmd.CommandText = $"SELECT * FROM edges";
            reader = cmd.ExecuteReader();
            int j = 0;
            while (reader.Read())
            {
                j++;
                string type = (string)reader["type"];
                int id = Convert.ToInt32(reader["id"]);
                int start = Convert.ToInt32(reader["start"]);
                int end = Convert.ToInt32(reader["end"]);
                bool oneway = toBool(reader["oneway"]);
                double weight = (double)reader["weight"];
                List<PointD> points = new List<PointD>();
                string[] substrings = ((string)reader["geometry"]).Split("&&");
                foreach (string s in substrings)
                {
                    if (s == "")
                    {
                        continue;
                    }
                    string[] values = s.Split(";");
                    points.Add(new PointD(Convert.ToDouble(values[0]), Convert.ToDouble(values[1])));
                }
                BasicEdge newedge = new BasicEdge(id, new LineD(points.ToArray()), start, end, weight, type, oneway);
                edgearr[id] = newedge;
            }
            reader.Close();
            conn.Close();
            return new BasicGraph(nodearr, edgearr);
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

        /// <summary>
        /// instanciates Graph from .graph file
        /// </summary>
        /// <param name="url">path to file</param>
        /// <returns>Graph object</returns>
        /// <exception cref="FileNotFoundException">thrown if file doesnt exist</exception>
        public Graph loadGraph(string url)
        {
            FileInfo f = new FileInfo(url);
            if (!f.Exists || f.Name.Split(".")[1] != "graph")
            {
                throw new FileNotFoundException("specified path doesnt meet requirements");
            }
            Byte[] data = File.ReadAllBytes(url);
            MemoryStream ms = new MemoryStream(data);
            BinaryReader br = new BinaryReader(ms);
            int nodecount = br.ReadInt32();
            GraphNode[] nodearr = new GraphNode[nodecount];
            for (int i = 0; i < nodecount; i++)
            {
                int id = i;
                double x = br.ReadDouble();
                double y = br.ReadDouble();
                int c = br.ReadInt32();
                for (int j = 0; j < c; j++)
                {
                    br.ReadInt32();
                }
                GraphNode newnode = new GraphNode(id, new PointD(x, y));
                nodearr[id] = newnode;
            }
            int edgecount = br.ReadInt32();
            GraphEdge[] edgearr = new GraphEdge[edgecount];
            for (int i = 0; i < edgecount; i++)
            {
                int id = i;
                GraphNode start = nodearr[br.ReadInt32()];
                GraphNode end = nodearr[br.ReadInt32()];
                double weight = br.ReadDouble();
                bool oneway = br.ReadBoolean();
                string type = "residential";
                List<PointD> points = new List<PointD>();
                int c = br.ReadInt32();
                for (int j = 0; j < c; j++)
                {
                    double x = br.ReadDouble();
                    double y = br.ReadDouble();
                    points.Add(new PointD(x, y));
                }
                GraphEdge newedge = new GraphEdge(id, new LineD(points.ToArray()), start, end, weight, type, oneway);
                start.addEdge(newedge);
                end.addEdge(newedge);
                edgearr[id] = newedge;
            }
            return new Graph(nodearr, edgearr);
        }

        public BaseGraph loadBaseGraph(string url)
        {
            FileInfo f = new FileInfo(url);
            if (!f.Exists || f.Name.Split(".")[1] != "graph")
            {
                throw new FileNotFoundException("specified path doesnt meet requirements");
            }
            Byte[] data = File.ReadAllBytes(url);
            MemoryStream ms = new MemoryStream(data);
            BinaryReader br = new BinaryReader(ms);
            int nodecount = br.ReadInt32();
            Node[] nodearr = new Node[nodecount];
            PointD[] pointarr = new PointD[nodecount];
            for (int i = 0; i < nodecount; i++)
            {
                int id = i;
                double x = br.ReadDouble();
                double y = br.ReadDouble();
                int c = br.ReadInt32();
                int[] edges = new int[c];
                for (int j = 0; j < c; j++)
                {
                    edges[j] = br.ReadInt32();
                }
                nodearr[id] = new Node(id, 1, edges); 
                pointarr[id] = new PointD(x, y);
            }
            int edgecount = br.ReadInt32();
            Edge[] edgearr = new Edge[edgecount];
            LineD[] linearr = new LineD[edgecount];
            int[] weightarr = new int[edgecount];
            for (int i = 0; i < edgecount; i++)
            {
                int id = i;
                int start = br.ReadInt32();
                int end = br.ReadInt32();
                int weight = (int)br.ReadDouble();
                bool oneway = br.ReadBoolean();
                byte type = 1;
                List<PointD> points = new List<PointD>();
                int c = br.ReadInt32();
                for (int j = 0; j < c; j++)
                {
                    double x = br.ReadDouble();
                    double y = br.ReadDouble();
                    points.Add(new PointD(x, y));
                } 
                edgearr[id] = new Edge(id, start, end, oneway, type);
                linearr[id] = new LineD(points.ToArray());
                weightarr[id] = weight;
            }
            return new BaseGraph(edgearr, nodearr, new Geometry(pointarr, linearr), new Weighting(weightarr, new int[0,0,0]));
        }
    }
}
