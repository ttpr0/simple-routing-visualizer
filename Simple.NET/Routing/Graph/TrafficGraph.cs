using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    public class TrafficGraph : IGraph
    {
        private Edge[] edges;
        private EdgeAttributes[] edgeattributes;
        private TrafficNode[] nodes;
        private NodeAttributes[] nodeattributes;
        private IGeometry geom;
        private IWeighting weight;
        private TrafficTable traffic;

        public TrafficGraph(Edge[] edges, EdgeAttributes[] edgeattributes, TrafficNode[] nodes, NodeAttributes[] nodeattributes, IGeometry geometry, IWeighting weighting, TrafficTable traffic)
        {
            this.edges = edges;
            this.edgeattributes = edgeattributes;
            this.nodes = nodes;
            this.nodeattributes = nodeattributes;
            this.geom = geometry;
            this.weight = weighting;
            this.traffic = traffic;
        }

        public int getOtherNode(int edge, int node, out Direction direction)
        {
            Edge e = edges[edge];
            if (node == e.nodeA)
            {
                direction = Direction.forward;
                return e.nodeB;
            }
            if (node == e.nodeB)
            {
                direction = Direction.backward;
                return e.nodeA;
            }
            direction = 0;
            return 0;
        }

        public bool isNode(int node)
        {
            if (node < this.nodes.Length)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public byte getEdgeIndex(int edge, int node)
        {
            return 0;
        }

        public ref NodeAttributes getNode(int node)
        {
            return ref this.nodeattributes[node];
        }

        public ref EdgeAttributes getEdge(int edge)
        {
            return ref this.edgeattributes[edge];
        }

        public int edgeCount()
        { return this.edges.Length; }

        public int nodeCount()
        { return this.nodes.Length; }

        public IEdgeRefStore getAdjacentEdges(int node)
        {
            return new EdgeRefArray(this.nodes[node].edges);
        }

        public void forEachEdge(int node, Action<int> func)
        {

        }

        public IGeometry getGeometry()
        {
            return geom;
        }

        public IWeighting getWeighting()
        {
            return weight;
        }

        public TrafficTable getTraffic()
        {
            return this.traffic;
        }
    }

    public unsafe struct EdgeRefArray : IEdgeRefStore
    {
        public int[] edges { get; set; }
        public int length 
        { 
            get { return edges.Length; }
        }

        public EdgeRefArray(int[] edges)
        {
            this.edges = edges;
        }

        public int this[int a]
        {
            get { return edges[a]; }
        }
    }
}
