﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace RoutingVisualizer.TileMapRenderer
{
    class TileMap : MapInterface
    {
        private TileFactory tilefactory;
        private Bitmap map;
        private Graphics g;
        private int width;
        private int height;

        public TileMap(int width, int height, string origin = "tiles.xml")
        {
            this.width = width;
            this.height = height;
            this.map = new Bitmap(width, height);
            this.g = Graphics.FromImage(this.map);
            this.tilefactory = new TileFactory(new TileDataFactory(origin));
        }

        public Bitmap createMap(PointD upperleft, int z)
        {
            g.Clear(Color.Transparent);
            double tilesize = 40075016.69 / Math.Pow(2, z);
            int x0 = (int)(upperleft.X / tilesize);
            int y0 = (int)(upperleft.Y / tilesize);
            int x1 = (int)((upperleft.X + this.width * tilesize / 256) / tilesize);
            int y1 = (int)((upperleft.Y - this.height * tilesize / 256) / tilesize);
            for (int i = x0; i <= x1; i++)
            {
                for (int j = y1; j <= y0; j++)
                {
                    Tile tile = this.tilefactory.getTile(i, j, z);
                    if (tile == null)
                    {
                        continue;
                    }
                    g.DrawImage(tile.maptile, (int)((tile.upperleft.X - upperleft.X) * 256 / tilesize), (int)((upperleft.Y - tile.upperleft.Y) * 256 / tilesize));
                }
            }
            return this.map;
        }
    }
}
