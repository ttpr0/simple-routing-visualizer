using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    public class TrafficTable
    {
        public int[] edgetraffic;

        public TrafficTable(int[] egdes)
        {
            this.edgetraffic = egdes;
        }

        public void addTraffic(int edge)
        {
            this.edgetraffic[edge] += 1;
        }

        public void subTraffic(int edge)
        {
            this.edgetraffic[edge] -= 1;
        }

        public int getTraffic(int edge)
        {
            return this.edgetraffic[edge];
        }
    }
}
