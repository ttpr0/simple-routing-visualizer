﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using Simple.GeoData;

namespace Simple.Maps.TileMap
{
    /// <summary>
    /// Map-Tile class
    /// </summary>
    class Tile
    {
        public Bitmap maptile { get; }
        public int x { get; }
        public int y { get; }
        public int z { get; }
        private static int size = 256;
        private double tilesize;
        public PointD upperleft { get; }

        /// <summary>
        /// Constructor using vector-tile (TileData)
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="z"></param>
        /// <param name="tiledata"></param>
        public Tile(int x, int y, int z, TileData tiledata)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.tilesize = 40075016.69 / Math.Pow(2, this.z);
            this.upperleft = new PointD(tilesize * this.x, tilesize * this.y + tilesize);
            this.maptile = new Bitmap(size, size);
            this.createTileMap(tiledata);
        }

        /// <summary>
        /// Constructor using raster-tile (Bitmap)
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="z"></param>
        /// <param name="map"></param>
        public Tile(int x, int y, int z, Bitmap map)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.tilesize = 40075016.69 / Math.Pow(2, this.z);
            this.upperleft = new PointD(tilesize * this.x, tilesize * this.y + tilesize);
            this.maptile = map;
        }

        private Pen highwaypen = new Pen(Color.Orange, 2);
        private Pen majorstreetpen = new Pen(Color.DarkRed, 1);
        private Pen streetpen = new Pen(Color.Green, 1);
        private Pen trackpen = new Pen(Color.LightGray, 1);
        /// <summary>
        /// draws vector-tile data to Bitmap
        /// </summary>
        /// <param name="tiledata"></param>
        private void createTileMap(TileData tiledata)
        {
            Graphics g = Graphics.FromImage(this.maptile);
            List<Way> lines = tiledata.getData();
            for (int i = 0; i < lines.Count; i++)
            {
                string type = lines[i].type;
                if (type == "trunk" || type == "motorway" || type == "trunk_link" || type == "motorway_link")
                {
                    g.DrawLines(highwaypen, transformLine(lines[i].line));
                }
                else if (type == "tertiary" || type == "secondary" || type == "primary" || type == "tertiary_link" || type == "secondary_link" || type == "primary_link")
                {
                    g.DrawLines(majorstreetpen, transformLine(lines[i].line));
                }
                else if (type == "residential" || type == "road" || type == "living_street")
                {
                    g.DrawLines(streetpen, transformLine(lines[i].line));
                }
                else if (type == "track" || type == "service")
                {
                    g.DrawLines(trackpen, transformLine(lines[i].line));
                }
            }
        }

        /// <summary>
        /// transforms LineD (web-mercator) to Point[] (screen coordinates)
        /// </summary>
        /// <param name="line"></param>
        /// <returns></returns>
        private Point[] transformLine(LineD line)
        {
            Point[] points = new Point[line.points.Length];
            for (int i = 0; i < line.points.Length; i++)
            {
                double x = (line.points[i].lon - upperleft.lon) * size / tilesize;
                double y = -(line.points[i].lat - upperleft.lat) * size / tilesize;
                points[i] = new Point((int)x, (int)y);
            }
            return points;
        }
    }
}