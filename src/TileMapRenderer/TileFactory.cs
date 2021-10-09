﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.Drawing.Imaging;

namespace RoutingVisualizer.TileMapRenderer
{
    class TileFactory
    {
        private Dictionary<string, Tile> tilecache;
        private TileDataFactory datacache;

        public TileFactory(TileDataFactory datacache)
        {
            this.tilecache = new Dictionary<string, Tile>();
            this.datacache = datacache;
        }

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

        private void loadTile(int x, int y, int z, string key)
        {
            if (z <= 14 && z >= 8)
            {
                Bitmap map = datacache.getTileBitmap(x, y, z);
                NavForm.changed();
                if (map == null)
                {
                    return;
                }
                try
                {
                    tilecache.Add(key, new Tile(x, y, z, map));
                    NavForm.changed();
                }
                catch (Exception)
                {
                    return;
                }
            }
            TileData tiledata = datacache.getTileData(x, y, z);
            if (tiledata == null)
            {
                return;
            }
            try
            {
                tilecache.Add(key, new Tile(x, y, z, tiledata));
                NavForm.changed();
            }
            catch (Exception)
            {
                return;
            }
        }
    }
}
