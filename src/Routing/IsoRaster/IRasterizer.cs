using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.IsoRaster
{
    interface IRasterizer
    {
        public (int, int) pointToIndex(Point point);
        public Point indexToPoint(int x, int y);
    }
}
