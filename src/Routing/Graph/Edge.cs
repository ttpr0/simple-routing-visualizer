using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    struct Edge
    {
        public int nodeA;
        public int nodeB;
        public bool oneway;
        public byte type;

        public Edge(int nodeA, int nodeB, bool oneway, byte type)
        {
            this.type = type; 
            this.nodeA = nodeA;
            this.nodeB = nodeB;
            this.oneway = oneway;
        }
    }
}
