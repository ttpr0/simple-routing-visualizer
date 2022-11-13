using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace RoutingVisualizer.IsoRaster
{
    public class WebMercatorProjection : IProjection
    {
        public Coord proj(Coord point)
        {
            int a = 6378137;
            Coord c = new Coord();
            c[0] = (float)(a * point[0] * Math.PI / 180);
            c[1] = (float)(a * Math.Log(Math.Tan(Math.PI / 4 + point[1] * Math.PI / 360)));
            return c;
        }

        public Coord reproj(Coord point)
        {
            int a = 6378137;
            Coord c = new Coord();
            c[0] = (float)(point[0] * 180 / (a * Math.PI));
            c[1] = (float)(360 * (Math.Atan(Math.Exp(point[1] / a)) - Math.PI / 4) / Math.PI);
            return c;
        }
    }
}