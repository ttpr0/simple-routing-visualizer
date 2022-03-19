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
        public double value;
        public PolygonD(PointD[] points, double value = 0)
        {
            this.points = points;
            this.value = value;
        }
    }
}
