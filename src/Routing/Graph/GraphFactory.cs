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
    static class GraphFactory
    {
        /// <summary>
        /// loads BaseGraph from .graph file
        /// </summary>
        /// <param name="url">path to file</param>
        /// <returns>BaseGraph</returns>
        /// <exception cref="FileNotFoundException"></exception>
        public static BaseGraph loadBaseGraph(string url)
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
            TurnCostMatrix<int>[] turnweightarr = new TurnCostMatrix<int>[nodecount];
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
                int[,] weights = new int[c, c];
                nodearr[id] = new Node(1, edges); 
                pointarr[id] = new PointD(x, y);
                turnweightarr[id] = new TurnCostMatrix<int>(weights);
            }
            int edgecount = br.ReadInt32();
            Edge[] edgearr = new Edge[edgecount];
            LineD[] linearr = new LineD[edgecount];
            int[] edgeweightarr = new int[edgecount];
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
                edgearr[id] = new Edge(start, end, oneway, type);
                linearr[id] = new LineD(points.ToArray());
                edgeweightarr[id] = weight;
            }
            return new BaseGraph(edgearr, nodearr, new Geometry(pointarr, linearr), new Weighting(edgeweightarr, turnweightarr));
        }

        public static TrafficGraph loadTrafficGraph(string url)
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
            TurnCostMatrix<int>[] turnweightarr = new TurnCostMatrix<int>[nodecount];
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
                int[,] weights = new int[c, c];
                nodearr[id] = new Node(1, edges);
                pointarr[id] = new PointD(x, y);
                turnweightarr[id] = new TurnCostMatrix<int>(weights);
            }
            int edgecount = br.ReadInt32();
            Edge[] edgearr = new Edge[edgecount];
            LineD[] linearr = new LineD[edgecount];
            int[] edgeweightarr = new int[edgecount];
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
                edgearr[id] = new Edge(start, end, oneway, type);
                linearr[id] = new LineD(points.ToArray());
                edgeweightarr[id] = weight;
            }
            TrafficTable t = new TrafficTable(new int[edgearr.Length]);
            return new TrafficGraph(edgearr, nodearr, new Geometry(pointarr, linearr), new TrafficWeighting(edgeweightarr, t), t);
        }
    }
}
