using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    class GeoJsonLineString
    {
        public string type { get; set; }
        public object geometry { get; }
        public object properties { get; set; }
        public GeoJsonLineString(Line line, double value = 0)
        {
            this.type = "Feature";
            this.geometry = new { type = "LineString", coordinates = line };
            this.properties = new { value = value };
        }
    }
}
