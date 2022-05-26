using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    public struct ValuePointD
    {
        public int value;
        public Coord point;

        public ValuePointD(Coord point, int value)
        {
            this.point = point;
            this.value = value;
        }
    }
}
