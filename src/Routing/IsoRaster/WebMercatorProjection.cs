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
        public void proj(ref Point point)
        {
            int a = 6378137;
            point[0] = (float)(a * point[0] * Math.PI / 180);
            point[1] = (float)(a * Math.Log(Math.Tan(Math.PI / 4 + point[1] * Math.PI / 360)));
        }

        public void reproj(ref Point point)
        {
            int a = 6378137;
            point[0] = (float)(point[0] * 180 / (a * Math.PI));
            point[1] = (float)(360 * (Math.Atan(Math.Exp(point[1] / a)) - Math.PI / 4) / Math.PI);
        }
    }
}