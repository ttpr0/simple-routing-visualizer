using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    /// <summary>
    /// utility functions for Graph
    /// </summary>
    static class GraphUtils
    {
        public static double getDistance(Node first, Node second)
        {
            return Math.Sqrt(Math.Pow(first.point.lon - second.point.lon, 2) + Math.Pow(first.point.lat - second.point.lat, 2));
        }
        public static double getDistance(DBGraphNode first, DBGraphNode second)
        {
            return Math.Sqrt(Math.Pow(first.point.lon - second.point.lon, 2) + Math.Pow(first.point.lat - second.point.lat, 2));
        }
        public static double getDistance(BasicNode first, BasicNode second)
        {
            return Math.Sqrt(Math.Pow(first.point.lon - second.point.lon, 2) + Math.Pow(first.point.lat - second.point.lat, 2));
        }
    }
}
