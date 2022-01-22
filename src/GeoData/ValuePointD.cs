using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    struct ValuePointD
    {
        public int value;
        public PointD point;

        public ValuePointD(PointD point, int value)
        {
            this.point = point;
            this.value = value;
        }
    }
}
