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
        public ICoord point;

        public ValuePointD(ICoord point, int value)
        {
            this.point = point;
            this.value = value;
        }
    }
}
