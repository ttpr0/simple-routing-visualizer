using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    struct PointD
    {
        public double lon { get; set; }
        public double lat { get; set; }

        public PointD(double x, double y)
        {
            this.lon = x;
            this.lat = y;
        }
    }
}
