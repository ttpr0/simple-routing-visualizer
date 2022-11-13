using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    public class TrafficWeighting : IWeighting
    {
        public int[] edgeweight;
        public TrafficTable traffic;

        public TrafficWeighting(int[] edges, TrafficTable traffic)
        {
            this.edgeweight = edges;
            this.traffic = traffic;
        }

        public int getEdgeWeight(int edge)
        {
            double factor = 1 + this.traffic.getTraffic(edge) / 20;
            return (int)(this.edgeweight[edge] * factor);
        }

        public int getTurnCost(int from, int via, int to)
        {
            return 0;
        }
    }
}
