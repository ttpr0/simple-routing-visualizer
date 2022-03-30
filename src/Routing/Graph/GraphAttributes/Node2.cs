using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    [StructLayout(LayoutKind.Explicit)]
    struct Node2
    {
        [FieldOffset(0)] public int offset;
        [FieldOffset(4)] public sbyte edgecount;

        public Node2(int offset, sbyte edgecount)
        {
            this.offset = offset;
            this.edgecount = edgecount;
        }
    }
}
