using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    struct Way
    {
        public Line line;
        public string type;
        public Way(Point[] points, string type)
        {
            this.line = new Line(points);
            this.type = type;
        }
    }
}
