using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    class BaseGraph
    {
        private Edge[] edges;
        private Node[] nodes;
        private Geometry geom;
        private Weighting weight;

        public BaseGraph(Edge[] edges, Node[] nodes, Geometry geometry, Weighting weighting)
        {
            this.edges = edges;
            this.nodes = nodes;
            this.geom = geometry;
            this.weight = weighting;
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

        public int edgeCount()
        { return this.edges.Length; }

        public int nodeCount()
        { return this.nodes.Length; }

        public int[] getAdjEdges(int node)
        {
            return nodes[node].edges;
        }

        public Geometry getGeometry()
        {
            return geom;
        }

        public Weighting getWeighting()
        {
            return weight;
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
            this.edges.Append(new Edge(i, nodeA, nodeB, oneway, type));
            this.geom.getLines().Append(line);
            this.weight.edgeweight.Append(weight);
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
                this.nodes.Append(new Node(i, type, new int[0]));
                this.geom.getPoints().Append(point);
                return i;
            }
            catch (Exception)
            {
                return -1;
            }
        }
    }
}
