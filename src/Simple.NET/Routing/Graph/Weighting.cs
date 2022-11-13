using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    public class Weighting : IWeighting
    {
        public int[] edgeweight;
        public TurnCostMatrix<int>[] nodeweights;

        public Weighting(int[] edges, TurnCostMatrix<int>[] nodes)
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
            //if (from == -1 || to == -1)
            //{
            //    return 0;
            //}
            //return this.nodeweights[via][from, to];
            return 0;
        }
    }
}
