using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    [StructLayout(LayoutKind.Explicit)]
    struct Edge2
    {
        [FieldOffset(0)] public int nodeA;
        [FieldOffset(4)] public int nodeB;

        public Edge2(int nodeA, int nodeB)
        {
            this.nodeA = nodeA;
            this.nodeB = nodeB;
        }
    }
}
