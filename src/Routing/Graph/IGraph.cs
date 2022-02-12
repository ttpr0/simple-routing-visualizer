using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    interface IGraph
    {
        public IGeometry getGeometry();

        public IWeighting getWeighting();

        public TrafficTable getTraffic();

        public int getOtherNode(int edge, int node);

        public int[] getAdjacentEdges(int node);

        public int nodeCount();

        public int edgeCount();

        public ref Node getNode(int node);

        public ref Edge getEdge(int edge);

        public bool isNode(int node);
    }
}
