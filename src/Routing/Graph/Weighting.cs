using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    class Weighting
    {
        public int[] edgeweight;
        public int[,,] nodeweights;

        public Weighting(int[] edges, int[,,] nodes)
        {
            this.edgeweight = edges;
            this.nodeweights = nodes;
        }

        public int getEdgeWeight(int edge)
        {
            return this.edgeweight[edge];
        }

        public int getTurnCost(int from, int via, int to)
        {
            return 0;
        }
    }
}
