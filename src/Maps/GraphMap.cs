using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using Simple.Routing.Graph;
using Microsoft.Data.Sqlite;
using Simple.GeoData;

namespace Simple.Maps
{
    /// <summary>
    /// Map that draws list of Graphedges set to visited,
    /// only draws visited GraphEdge once and marks it drawn
    /// Map should not be moved while using GraphMap
    /// </summary>
    class GraphMap : IMap
    {
        private Bitmap map;
        private BasicEdge[] edges;
        private Graphics g;

        private SqliteConnection conn;
        private SqliteCommand cmd;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="width">width of Map</param>
        /// <param name="height">height of Map</param>
        /// <param name="graph">list of GraphEdges to be drawn</param>
        public GraphMap(int width, int height, BasicGraph graph)
        {
            this.map = new Bitmap(width, height);
            this.edges = graph.getEdges();
            this.g = Graphics.FromImage(this.map);

            this.conn = new SqliteConnection("Data Source=data/graph.db");
            conn.Open();
            this.cmd = conn.CreateCommand();
        }

        private Pen visitedpen = new Pen(Color.MediumVioletRed, 2);
        private PointD upperleft;
        /// <summary>
        /// draws map, only GraphEdges marked visited and !drawn are used
        /// Map should not be moved while using this function, before moving re-init Graph
        /// </summary>
        /// <param name="upperleft">upperleft of Bitmap, real-world coordinates (web-mercator, x from Greenwich / y from equator)</param>
        /// <param name="zoom">zoom level (for tile-map)</param>
        /// <returns>drawn Bitmap</returns>
        public Bitmap createMap(PointD upperleft, int zoom)
        {
            double tilesize = 40075016.69 / Math.Pow(2, zoom);
            this.upperleft = upperleft;
            foreach (BasicEdge edge in edges)
            {
                if (edge.isVisited() && !edge.data.drawn)
                {
                    Point[] points = new Point[edge.line.points.Length];
                    for (int j = 0; j < edge.line.points.Length; j++)
                    {
                        points[j] = realToScreen(edge.line.points[j], tilesize);
                    }
                    g.DrawLines(visitedpen, points);
                    edge.data.drawn = true;
                }
            }
            return this.map;
        }

        /// <summary>
        /// clears Bitmap,
        /// have to be used after moving Map before using createMap
        /// </summary>
        public void clearMap()
        {
            g.Clear(Color.Transparent);
        }

        private Point realToScreen(PointD point, double tilesize)
        {
            double x = (point.X - upperleft.X) * 256 / tilesize;
            double y = -(point.Y - upperleft.Y) * 256 / tilesize;
            return new Point((int)x, (int)y);
        }
    }
}
