using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    struct LineD
    {
        public PointD[] points { get; }
        public LineD(PointD[] points)
        {
            this.points = points;
        }
    }
}
