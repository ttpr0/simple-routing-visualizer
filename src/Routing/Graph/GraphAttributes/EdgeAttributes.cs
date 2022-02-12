using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    struct EdgeAttributes
    {
        public RoadType type { get; set; }

        public int length;

        public int maxspeed;

        public bool oneway;

        public short fcapacity;

        public short bcapacity;

        public Access access;

        public Obstacles[] obstacles;

        public Restrictions[] restrictions;
    }
}
