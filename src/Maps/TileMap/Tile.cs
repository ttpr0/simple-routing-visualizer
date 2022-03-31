using System;
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
        private float tilesize;
        public Simple.GeoData.Point upperleft { get; }

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
            this.tilesize = (float)(40075016.69 / Math.Pow(2, this.z));
            this.upperleft = new Simple.GeoData.Point(tilesize * this.x, tilesize * this.y + tilesize);
            this.maptile = map;
        }
    }
}
