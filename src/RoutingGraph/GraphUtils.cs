using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    /// <summary>
    /// utility functions for Graph
    /// </summary>
    static class GraphUtils
    {
        public static double getDistance(GraphNode first, GraphNode second)
        {
            return Math.Sqrt(Math.Pow(first.point.X - second.point.X, 2) + Math.Pow(first.point.Y - second.point.Y, 2));
        }
        public static double getDistance(DBGraphNode first, DBGraphNode second)
        {
            return Math.Sqrt(Math.Pow(first.point.X - second.point.X, 2) + Math.Pow(first.point.Y - second.point.Y, 2));
        }
        public static double getDistance(BasicNode first, BasicNode second)
        {
            return Math.Sqrt(Math.Pow(first.point.X - second.point.X, 2) + Math.Pow(first.point.Y - second.point.Y, 2));
        }
    }
}
