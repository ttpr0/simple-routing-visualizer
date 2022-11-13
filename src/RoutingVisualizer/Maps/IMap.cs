using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using Simple.GeoData;

namespace Simple.Maps
{
    interface IMap
    {
        public Bitmap createMap(Coord upperleft, int zoom);
    }
}
