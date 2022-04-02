using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    class GeoJsonPoint
    {
        public string type { get; set; }
        public object geometry { get; }
        public object properties { get; set; }
        public GeoJsonPoint(ICoord coord, double value = 0)
        {
            this.type = "Feature";
            this.geometry = new { type = "LineString", coordinates = coord };
            this.properties = new { value = value };
        }
    }
}
