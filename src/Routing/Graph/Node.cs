using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    struct Node
    {
        public int id;
        public int[] edges;
        public byte type;

        public Node(int id, byte type, int[] edges)
        {
            this.id = id;
            this.type = type;
            this.edges = edges;
        }
    }
}
