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

        public static BaseGraph _loadBaseGraph(string url)
        {
            FileInfo f = new FileInfo(url);
            if (!f.Exists || f.Name.Split(".")[1] != "graph")
            {
                throw new FileNotFoundException("specified path doesnt meet requirements");
            }
            string filename = f.Name.Split(".")[0];
            Byte[] graphdata = File.ReadAllBytes(url);
            Byte[] attribdata = File.ReadAllBytes(f.DirectoryName + "/" + filename + "-attrib");
            MemoryStream graphstream = new MemoryStream(graphdata);
            BinaryReader graphreader = new BinaryReader(graphstream);
            int nodecount = graphreader.ReadInt32();
            int edgecount = graphreader.ReadInt32();
            int startindex = 8 + nodecount * 5 + edgecount * 8;
            MemoryStream edgerefstream = new MemoryStream(graphdata, startindex, graphdata.Length - startindex);
            BinaryReader edgerefreader = new BinaryReader(edgerefstream);
            MemoryStream attribstream = new MemoryStream(attribdata);
            BinaryReader attribreader = new BinaryReader(attribstream);
            Node[] nodearr = new Node[nodecount];
            for (int i = 0; i < nodecount; i++)
            {
                int s = graphreader.ReadInt32();
                sbyte c = graphreader.ReadSByte();
                int[] edges = new int[c];
                for (int j = 0; j < c; j++)
                {
                    edges[j] = edgerefreader.ReadInt32();
                }
                sbyte t = attribreader.ReadSByte();
                nodearr[i] = new Node((byte)t, edges);
            }
            Edge[] edgearr = new Edge[edgecount];
            for (int i = 0; i < edgecount; i++)
            {
                int start = graphreader.ReadInt32();
                int end = graphreader.ReadInt32();
                sbyte type = attribreader.ReadSByte();
                attribreader.ReadInt32();
                attribreader.ReadByte();
                bool oneway = attribreader.ReadBoolean();
                edgearr[i] = new Edge(start, end, oneway, (byte)type);
            }
            graphreader.Close();
            edgerefreader.Close();
            attribreader.Close();
            graphstream.Close();
            edgerefstream.Close();
            attribstream.Close();
            Byte[] weightdata = File.ReadAllBytes(f.DirectoryName + "/" + filename + "-weight");
            MemoryStream weightstream = new MemoryStream(weightdata);
            BinaryReader weightreader = new BinaryReader(weightstream);
            int[] edgeweights = new int[edgecount];
            for (int i = 0; i < edgecount; i++)
            {
                edgeweights[i] = weightreader.ReadByte();
            }
            weightreader.Close();
            weightstream.Close();
            Byte[] geomdata = File.ReadAllBytes(f.DirectoryName + "/" + filename + "-geom");
            startindex = nodecount * 8 + edgecount * 5;
            MemoryStream geomstream = new MemoryStream(geomdata);
            BinaryReader geomreader = new BinaryReader(geomstream);
            MemoryStream linestream = new MemoryStream(geomdata, startindex, geomdata.Length - startindex);
            BinaryReader linereader = new BinaryReader(linestream);
            PointD[] pointarr = new PointD[nodecount];
            for (int i = 0; i < nodecount; i++)
            {
                float lon = geomreader.ReadSingle();
                float lat = geomreader.ReadSingle();
                pointarr[i] = new PointD(lon, lat);
            }
            LineD[] linearr = new LineD[edgecount];
            for (int i = 0; i < edgecount; i++)
            {
                int s = geomreader.ReadInt32();
                byte c = geomreader.ReadByte();
                List<PointD> points = new List<PointD>();
                for (int j = 0; j < c; j++)
                {
                    float lon = linereader.ReadSingle();
                    float lat = linereader.ReadSingle();
                    points.Add(new PointD(lon, lat));
                }
                linearr[i] = new LineD(points.ToArray());
            }
            geomreader.Close();
            linereader.Close();
            geomstream.Close();
            linestream.Close();
            return new BaseGraph(edgearr, nodearr, new Geometry(pointarr, linearr), new Weighting(edgeweights, null));
        }
    }
}
