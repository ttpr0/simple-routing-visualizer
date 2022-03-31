using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    struct TrafficNode
    {
        public int[] edges;

        public TrafficNode(int[] edges)
        {
            this.edges = edges;
        }
    }
}
