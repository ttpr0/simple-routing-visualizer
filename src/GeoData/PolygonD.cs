using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    class PolygonD
    {
        public PointD[] points { get; }
        public PolygonD(PointD[] points)
        {
            this.points = points;
        }
    }
}
