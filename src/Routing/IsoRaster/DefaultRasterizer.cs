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

        private float factor;
        public DefaultRasterizer(float precession)
        {
            this.factor = 1 / precession;
            this.projection = new WebMercatorProjection();
        }

        public (int, int) pointToIndex(Point point)
        {
            this.projection.proj(ref point);
            return ((int)(point[0] * factor), (int)(point[1] * factor));
        }

        public Point indexToPoint(int x, int y)
        {   
            Point point = new Point(x/factor, y/factor);
            this.projection.reproj(ref point);
            return point;
        }
    }
}