using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    struct Way
    {
        public ICoordArray line;
        public string type;
        public Way(Coord[] points, string type)
        {
            this.line = new CoordArray(points);
            this.type = type;
        }
    }
}
