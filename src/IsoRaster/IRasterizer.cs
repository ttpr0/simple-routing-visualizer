using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace RoutingVisualizer.IsoRaster
{
    public interface IRasterizer
    {
        public (int, int) pointToIndex(Coord point);
        public Coord indexToPoint(int x, int y);
    }
}
