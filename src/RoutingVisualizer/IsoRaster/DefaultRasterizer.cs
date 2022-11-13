using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace RoutingVisualizer.IsoRaster
{
    public class DefaultRasterizer : IRasterizer
    {
        private IProjection projection;

        private float factor;
        public DefaultRasterizer(float precession)
        {
            this.factor = 1 / precession;
            this.projection = new WebMercatorProjection();
        }

        public (int, int) pointToIndex(Coord point)
        {
            Coord c = this.projection.proj(point);
            return ((int)(c[0] * factor), (int)(c[1] * factor));
        }

        public Coord indexToPoint(int x, int y)
        {   
            Coord point = new Coord(x/factor, y/factor);
            return this.projection.reproj(point);
        }
    }
}