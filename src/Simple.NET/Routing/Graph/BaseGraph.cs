using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.InteropServices;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    public unsafe class BaseGraph : IGraph, IDisposable
    {
        private static int EDGESIZE = sizeof(Edge);
        private static int NODESIZE = sizeof(Node);
        private static int EDGEATTRIBSIZE = sizeof(EdgeAttributes);
        private static int NODEATTRIBSIZE = sizeof(NodeAttributes);

        private int nodecount;
        private int edgecount;
        private byte* graph = (byte*)IntPtr.Zero;
        private byte* attrib = (byte*)IntPtr.Zero;
        private IGeometry geom;
        private IWeighting weight;
        private TrafficTable traffic;

        public BaseGraph(int nodecount, int edgecount, byte[] graph, byte[] attrib, IGeometry geometry, IWeighting weighting)
        {
            this.nodecount = nodecount;
            this.edgecount = edgecount;
            this.graph = (byte*)Marshal.AllocHGlobal(graph.Length);
            Marshal.Copy(graph, 8, (IntPtr)this.graph, graph.Length-8);
            graph = null;
            this.attrib = (byte*)Marshal.AllocHGlobal(attrib.Length);
            Marshal.Copy(attrib, 0, (IntPtr)this.attrib, attrib.Length);
            attrib = null;
            this.geom = geometry;
            this.weight = weighting;
            this.traffic = new TrafficTable(new int[edgecount]);
            
        }

        public int getOtherNode(int edge, int node, out Direction direction)
        {
            Edge* e = (Edge*)(this.graph + NODESIZE * nodecount + EDGESIZE * edge);
            if (node == e->nodeA)
            {
                direction = Direction.forward;
                return e->nodeB;
            }
            if (node == e->nodeB)
            {
                direction = Direction.backward;
                return e->nodeA;
            }
            direction = 0;
            return 0;
        }

        public bool isNode(int node)
        {
            if (node < this.nodecount)
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
            return ref *(NodeAttributes*)(this.attrib + NODEATTRIBSIZE * node);
        }

        public ref EdgeAttributes getEdge(int edge)
        {
            return ref *(EdgeAttributes*)(this.attrib + NODEATTRIBSIZE * nodecount + EDGEATTRIBSIZE * edge);
        }

        public int edgeCount()
        { return this.edgecount; }

        public int nodeCount()
        { return this.nodecount; }

        public IEdgeRefStore getAdjacentEdges(int node)
        {
            Node* n = (Node*)(this.graph + NODESIZE * node);
            return new EdgeRefPointer((int*)(this.graph + NODESIZE * nodecount + EDGESIZE * edgecount + n->offset), n->edgecount);
        }

        public void forEachEdge(int node, Action<int> func)
        {
            Node* n = (Node*)(this.graph + NODESIZE * node);
            for (int i = 0; i < n->edgecount; i++)
            {
                func(*(int*)(this.graph + NODESIZE * nodecount + EDGESIZE * edgecount + n->offset));
            }
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

        private bool disposed = false;

        ~BaseGraph()
        {
            Dispose(false);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                this.disposed = true;
                if (this.graph != (byte*)IntPtr.Zero)
                {
                    Marshal.FreeHGlobal((IntPtr)this.graph);
                    this.graph = (byte*)IntPtr.Zero;
                }
                if (this.attrib != (byte*)IntPtr.Zero)
                {
                    Marshal.FreeHGlobal((IntPtr)this.attrib);
                    this.attrib = (byte*)IntPtr.Zero;
                }
            }
        }
    }

    public unsafe struct EdgeRefPointer : IEdgeRefStore
    {
        public int* ptr { get; set; }
        public int length { get; set; }

        public EdgeRefPointer(int* ptr, int length)
        {
            this.ptr = ptr;
            this.length = length;
        }

        public int this[int a]
        {
            get { return *(ptr + a); }
        }
    }
}
