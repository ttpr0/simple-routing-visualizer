using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    class PointCloudD
    {
        public ValuePointD[] points;
        public PointCloudD(ValuePointD[] points)
        {
            this.points = points;
        }

        public void addPoint(ValuePointD point)
        {
            this.points.Append(point);
        }
    }
}
