using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.ShortestPathTree
{
    public  interface IConsumer
    {
        public void consumePoint(Coord point, int value);
    }
}
