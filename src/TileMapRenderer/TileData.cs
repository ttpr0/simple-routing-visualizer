using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace RoutingVisualizer.TileMapRenderer
{
    /// <summary>
    /// container for vector-tile data
    /// </summary>
    class TileData
    {
        private List<Way> ways;
        public int x { get; }
        public int y { get; }
        public int z { get; }

        //need changes
        public TileData(List<Way> ways, int x, int y, int z)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.ways = ways;
        }

        //need changes
        public List<Way> getData()
        {
            return ways;
        }
    }
}
