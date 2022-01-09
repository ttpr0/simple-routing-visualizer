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
