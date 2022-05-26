using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    public interface IGraph
    {
        public IGeometry getGeometry();

        public IWeighting getWeighting();

        public TrafficTable getTraffic();

        public int getOtherNode(int edge, int node, out Direction direction);

        public byte getEdgeIndex(int edge, int node);

        public IEdgeRefStore getAdjacentEdges(int node);

        public void forEachEdge(int node, Action<int> func);

        public int nodeCount();

        public int edgeCount();

        public bool isNode(int node);

        public ref NodeAttributes getNode(int node);

        public ref EdgeAttributes getEdge(int edge);
    }

    public interface IEdgeRefStore
    {
        public int this[int a] { get; }
        public int length { get; }
    }
}
