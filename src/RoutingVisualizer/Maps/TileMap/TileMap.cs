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
    /// Map that draws Map-Tiles
    /// </summary>
    class TileMap : IMap
    {
        private TileFactory tilefactory;
        private Bitmap map;
        private Graphics g;
        private int width;
        private int height;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="width">width of Bitmap</param>
        /// <param name="height">height of Bitmap</param>
        /// <param name="origin">data origin, used to create TileDataFactory</param>
        public TileMap(int width, int height, string origin = "tiles.xml")
        {
            this.width = width;
            this.height = height;
            this.map = new Bitmap(width, height);
            this.g = Graphics.FromImage(this.map);
            this.tilefactory = new TileFactory(new TileDataFactory(origin));
        }

        public TileFactory getFactory()
        {
            return this.tilefactory;
        }

        /// <summary>
        /// creates Map from Map-Tiles
        /// </summary>
        /// <param name="upperleft">upperleft of Bitmap, real-world coordinates (web-mercator, x from Greenwich / y from equator)</param>
        /// <param name="z">zoom level (for tile-map)</param>
        /// <returns>drawn Bitmap</returns>
        public Bitmap createMap(Coord upperleft, int z)
        {
            g.Clear(Color.Transparent);
            double tilesize = 40075016.69 / Math.Pow(2, z);
            int x0 = (int)(upperleft[0] / tilesize);
            int y0 = (int)(upperleft[1] / tilesize);
            int x1 = (int)((upperleft[0] + this.width * tilesize / 256) / tilesize);
            int y1 = (int)((upperleft[1] - this.height * tilesize / 256) / tilesize);
            for (int i = x0; i <= x1; i++)
            {
                for (int j = y1; j <= y0; j++)
                {
                    Tile tile = this.tilefactory.getTile(i, j, z);
                    if (tile == null)
                    {
                        continue;
                    }
                    g.DrawImage(tile.maptile, (int)((tile.upperleft[0] - upperleft[0]) * 256 / tilesize), (int)((upperleft[1] - tile.upperleft[1]) * 256 / tilesize));
                }
            }
            return this.map;
        }
    }
}
