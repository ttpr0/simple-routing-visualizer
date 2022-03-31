using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    class GeoJsonPolygon
    {
        public string type { get; set; }
        public object geometry { get; }
        public object properties { get; set; }
        public GeoJsonPolygon(Polygon polygon, double value = 0)
        {
            this.type = "Feature";
            this.geometry = new { type="Polygon", coordinates = polygon };
            this.properties = new { value = value };
        }
    }
}