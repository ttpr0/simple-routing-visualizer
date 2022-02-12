using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    class TrafficGraph : IGraph
    {
        private Edge[] edges;
        private Node[] nodes;
        private IGeometry geom;
        private TrafficWeighting weight;
        private TrafficTable traffic;

        public TrafficGraph(Edge[] edges, Node[] nodes, IGeometry geometry, TrafficWeighting weighting, TrafficTable traffic)
        {
            this.edges = edges;
            this.nodes = nodes;
            this.geom = geometry;
            this.weight = weighting;
            this.traffic = traffic;
        }

        public int getOtherNode(int edge, int node)
        {
            Edge e = edges[edge];
            if (node == e.nodeA)
            {
                return e.nodeB;
            }
            if (node == e.nodeB)
            {
                return e.nodeA;
            }
            return 0;
        }

        public ref Node getNode(int node)
        {
            return ref this.nodes[node];
        }

        public ref Edge getEdge(int edge)
        {
            return ref this.edges[edge];
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

        public int edgeCount()
        { return this.edges.Length; }

        public int nodeCount()
        { return this.nodes.Length; }

        public int[] getAdjacentEdges(int node)
        {
            return nodes[node].edges;
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

        /// <summary>
        /// creates an edge between two nodes
        /// </summary>
        /// <param name="nodeA">from</param>
        /// <param name="nodeB">to</param>
        /// <param name="oneway">true if oneway</param>
        /// <param name="type">byte-flag for edge-type</param>
        /// <param name="line">geometry</param>
        /// <param name="weight">weight of edge (e.g. sec to travel)</param>
        /// <returns>id if successfull, else -1</returns>
        public int addEdge(int nodeA, int nodeB, bool oneway, byte type, LineD line, int weight)
        {
            if ((nodeA >= this.nodes.Length) || (nodeB >= this.nodes.Length))
            {
                return -1;
            }
            int i = this.edges.Length;
            this.nodes[nodeA].edges.Append(i);
            this.nodes[nodeB].edges.Append(i);
            this.edges.Append(new Edge(nodeA, nodeB, oneway, type));
            this.geom.getAllEdges().Append(line);
            //this.weight.edgeweight.Append(weight);
            return i;
        }

        /// <summary>
        /// adds Node to graph (without edge references)
        /// </summary>
        /// <param name="type">type of node</param>
        /// <param name="point">location</param>
        /// <returns>id if successful, else -1</returns>
        public int addNode(byte type, PointD point)
        {
            try
            {
                int i = this.nodes.Length;
                this.nodes.Append(new Node(type, new int[0]));
                this.geom.getAllNodes().Append(point);
                return i;
            }
            catch (Exception)
            {
                return -1;
            }
        }
    }
}
