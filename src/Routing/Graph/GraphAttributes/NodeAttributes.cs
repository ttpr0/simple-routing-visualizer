using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    [StructLayout(LayoutKind.Explicit)]
    struct NodeAttributes
    {
        [FieldOffset(0)] public sbyte type;

        public NodeAttributes(sbyte type)
        {
            this.type = type;
        }
    }
}
