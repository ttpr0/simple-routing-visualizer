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
            string filename = f.Name.Split(".")[0];
            Byte[] graphdata = File.ReadAllBytes(url);
            MemoryStream graphstream = new MemoryStream(graphdata);
            BinaryReader graphreader = new BinaryReader(graphstream);
            int nodecount = graphreader.ReadInt32();
            int edgecount = graphreader.ReadInt32();
            Byte[] attribdata = File.ReadAllBytes(f.DirectoryName + "/" + filename + "-attrib");
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
            int startindex = nodecount * 8 + edgecount * 5;
            MemoryStream geomstream = new MemoryStream(geomdata);
            BinaryReader geomreader = new BinaryReader(geomstream);
            MemoryStream linestream = new MemoryStream(geomdata, startindex, geomdata.Length - startindex);
            BinaryReader linereader = new BinaryReader(linestream);
            ICoord[] pointarr = new ICoord[nodecount];
            for (int i = 0; i < nodecount; i++)
            {
                float lon = geomreader.ReadSingle();
                float lat = geomreader.ReadSingle();
                pointarr[i] = new Coord(lon, lat);
            }
            ICoordArray[] linearr = new ICoordArray[edgecount];
            for (int i = 0; i < edgecount; i++)
            {
                int s = geomreader.ReadInt32();
                byte c = geomreader.ReadByte();
                Coord[] points = new Coord[c];
                for (int j = 0; j < c; j++)
                {
                    points[j][0] = linereader.ReadSingle();
                    points[j][1] = linereader.ReadSingle();
                }
                linearr[i] = new CoordArray(points);
            }
            geomreader.Close();
            linereader.Close();
            geomstream.Close();
            linestream.Close();
            return new BaseGraph(nodecount, edgecount, graphdata, attribdata, new Geometry(pointarr, linearr), new Weighting(edgeweights, null));
        }

        public static TrafficGraph loadTrafficGraph(string url)
        {
            FileInfo f = new FileInfo(url);
            if (!f.Exists || f.Name.Split(".")[1] != "graph")
            {
                throw new FileNotFoundException("specified path doesnt meet requirements");
            }
            string filename = f.Name.Split(".")[0];
            Byte[] graphdata = File.ReadAllBytes(url);
            MemoryStream graphstream = new MemoryStream(graphdata);
            BinaryReader graphreader = new BinaryReader(graphstream);
            int nodecount = graphreader.ReadInt32();
            int edgecount = graphreader.ReadInt32();
            int startindex = 8 + nodecount * 5 + edgecount * 8;
            MemoryStream edgerefstream = new MemoryStream(graphdata, startindex, graphdata.Length - startindex);
            BinaryReader edgerefreader = new BinaryReader(edgerefstream);
            TrafficNode[] nodearr = new TrafficNode[nodecount];
            for (int i = 0; i < nodecount; i++)
            {
                int s = graphreader.ReadInt32();
                sbyte c = graphreader.ReadSByte();
                int[] edges = new int[c];
                for (int j = 0; j < c; j++)
                {
                    edges[j] = edgerefreader.ReadInt32();
                }
                nodearr[i] = new TrafficNode(edges);
            }
            Edge[] edgearr = new Edge[edgecount];
            for (int i = 0; i < edgecount; i++)
            {
                int start = graphreader.ReadInt32();
                int end = graphreader.ReadInt32();
                edgearr[i] = new Edge(start, end);
            }
            graphreader.Close();
            edgerefreader.Close();
            graphstream.Close();
            edgerefstream.Close();
            Byte[] attribdata = File.ReadAllBytes(f.DirectoryName + "/" + filename + "-attrib");
            MemoryStream attribstream = new MemoryStream(attribdata);
            BinaryReader attribreader = new BinaryReader(attribstream);
            NodeAttributes[] nodeattribarr = new NodeAttributes[nodecount];
            for (int i = 0; i < nodecount; i++)
            {
                sbyte type = attribreader.ReadSByte();
                nodeattribarr[i] = new NodeAttributes(type);
            }
            EdgeAttributes[] edgeattribarr = new EdgeAttributes[edgecount];
            for (int i = 0; i < edgecount; i++)
            {
                sbyte type = attribreader.ReadSByte();
                float length = attribreader.ReadSingle();
                byte maxspeed = attribreader.ReadByte();
                bool oneway = attribreader.ReadBoolean();
                edgeattribarr[i] = new EdgeAttributes((RoadType)type, length, maxspeed, oneway);
            }
            attribreader.Close();
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
            ICoord[] pointarr = new ICoord[nodecount];
            for (int i = 0; i < nodecount; i++)
            {
                float lon = geomreader.ReadSingle();
                float lat = geomreader.ReadSingle();
                pointarr[i] = new Coord(lon, lat);
            }
            ICoordArray[] linearr = new ICoordArray[edgecount];
            for (int i = 0; i < edgecount; i++)
            {
                int s = geomreader.ReadInt32();
                byte c = geomreader.ReadByte();
                Coord[] points = new Coord[c];
                for (int j = 0; j < c; j++)
                {
                    points[j][0] = linereader.ReadSingle();
                    points[j][1] = linereader.ReadSingle();
                }
                linearr[i] = new CoordArray(points);
            }
            geomreader.Close();
            linereader.Close();
            geomstream.Close();
            linestream.Close();
            TrafficTable t = new TrafficTable(new int[edgearr.Length]);
            return new TrafficGraph(edgearr, edgeattribarr, nodearr, nodeattribarr, new Geometry(pointarr, linearr), new Weighting(edgeweights, null), t);
        }
    }
}
