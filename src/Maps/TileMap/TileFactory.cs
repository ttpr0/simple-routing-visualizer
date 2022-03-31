using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.Drawing.Imaging;
using Simple.GeoData;
using RoutingVisualizer;

namespace Simple.Maps.TileMap
{
    /// <summary>
    /// Used to get and cache Map-Tiles from datasource
    /// </summary>
    class TileFactory
    {
        private Dictionary<string, Tile> tilecache;
        private TileDataFactory datacache;
        public Action changed;
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="datafactory">datasource</param>
        public TileFactory(TileDataFactory datafactory)
        {
            this.tilecache = new Dictionary<string, Tile>();
            this.datacache = datafactory;
        }

        /// <summary>
        /// returns Map-Tile either from cache or datasource
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="z"></param>
        /// <returns>Map-Tile</returns>
        public Tile getTile(int x, int y, int z)
        {
            string key = x.ToString() + "_" + y.ToString() + "_" + z.ToString();
            Tile tile;
            if (tilecache.TryGetValue(key, out tile))
            {
                return tile;
            }
            Task.Run(()=> 
            {
                loadTile(x, y, z, key);
            });
            return null;
        }

        /// <summary>
        /// loads Tile from datasource
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="z"></param>
        /// <param name="key">key-string for obtaining data from datasource</param>
        private void loadTile(int x, int y, int z, string key)
        {
            if (z <= 14 && z >= 8)
            {
                Bitmap map = datacache.getTileBitmap(x, y, z);
                this.changed();
                if (map == null)
                {
                    return;
                }
                try
                {
                    tilecache.Add(key, new Tile(x, y, z, map));
                    this.changed();
                }
                catch (Exception)
                {
                    return;
                }
            }
        }
    }
}
