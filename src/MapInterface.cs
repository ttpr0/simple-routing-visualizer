using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace RoutingVisualizer
{
    interface MapInterface
    {
        public Bitmap createMap(PointD upperleft, int zoom);
    }
}
