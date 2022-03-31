using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    [StructLayout(LayoutKind.Explicit)]
    struct EdgeAttributes
    {
        [FieldOffset(0)] public RoadType type;

        [FieldOffset(1)] public float length;

        [FieldOffset(5)] public byte maxspeed;

        [FieldOffset(6)] public bool oneway;

        public EdgeAttributes(RoadType type, float length, byte maxspeed, bool oneway)
        {
            this.type = type;
            this.length = length;
            this.maxspeed = maxspeed;
            this. oneway = oneway;
        }
    }
}
