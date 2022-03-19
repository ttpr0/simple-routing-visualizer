using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.IsoRaster
{
    class DefaultRasterizer : IRasterizer
    {
        private IProjection projection;

        private double factor;
        public DefaultRasterizer(float precession)
        {
            this.factor = 1 / precession;
            this.projection = new WebMercatorProjection();
        }

        public (int, int) pointToIndex(PointD point)
        {
            this.projection.proj(ref point);
            return ((int)(point.lon * factor), (int)(point.lat * factor));
        }

        public PointD indexToPoint(int x, int y)
        {   
            PointD point = new PointD(x/factor, y/factor);
            this.projection.reproj(ref point);
            return point;
        }
    }
}