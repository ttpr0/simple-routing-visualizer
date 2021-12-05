using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    struct Way
    {
        public LineD line;
        public string type;
        public Way(PointD[] points, string type)
        {
            this.line = new LineD(points);
            this.type = type;
        }
    }
}
