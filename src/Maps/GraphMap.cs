﻿using System;
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
        private Graphics g;
        private List<LineD> lines;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="width">width of Map</param>
        /// <param name="height">height of Map</param>
        /// <param name="graph">list of GraphEdges to be drawn</param>
        public GraphMap(int width, int height)
        {
            this.map = new Bitmap(width, height);
            this.g = Graphics.FromImage(this.map);
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
            foreach (LineD line in this.lines)
            {
                Point[] points = new Point[line.points.Length];
                for (int j = 0; j < line.points.Length; j++)
                {
                    points[j] = realToScreen(line.points[j], tilesize);
                }
                g.DrawLines(visitedpen, points);
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
            double x = (point.lon - upperleft.lon) * 256 / tilesize;
            double y = -(point.lat - upperleft.lat) * 256 / tilesize;
            return new Point((int)x, (int)y);
        }

        public void addLines(List<LineD> lines)
        {
            this.lines = lines;
        }
    }
}