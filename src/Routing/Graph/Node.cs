using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    struct Node
    {
        public int[] edges;
        public byte type;

        public Node(byte type, int[] edges)
        {
            this.type = type;
            this.edges = edges;
        }
    }
}
