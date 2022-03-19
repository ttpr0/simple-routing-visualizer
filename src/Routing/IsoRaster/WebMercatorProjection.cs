using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.IsoRaster
{
    class WebMercatorProjection : IProjection
    {
        public void proj(ref PointD point)
        {
            int a = 6378137;
            point.lon = a * point.lon * Math.PI / 180;
            point.lat = a * Math.Log(Math.Tan(Math.PI / 4 + point.lat * Math.PI / 360));
        }

        public void reproj(ref PointD point)
        {
            int a = 6378137;
            point.lon = point.lon * 180 / (a * Math.PI);
            point.lat = 360 * (Math.Atan(Math.Exp(point.lat / a)) - Math.PI / 4) / Math.PI;
        }
    }
}