using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.Routing.Graph;
using Simple.GeoData;

namespace Simple.Routing.ShortestPathTree
{
    public class ShortestPathTree
    {
        private PriorityQueue<int, int> heap;
        private int startid;
        private int maxvalue;
        private IGraph graph;
        private IGeometry geom;
        private IWeighting weight;
        private Flag[] flags;
        private IConsumer consumer;

        private struct Flag
        {
            public double pathlength;
            public bool visited;
        }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="start">startnode</param>
        /// <param name="end">endnode</param>
        public ShortestPathTree(IGraph graph, int start, int maxvalue, IConsumer consumer)
        {
            this.graph = graph;
            this.maxvalue = maxvalue;
            this.startid = start;
            this.heap = new PriorityQueue<int, int>();
            this.heap.Enqueue(this.startid, 0);
            this.flags = new Flag[graph.nodeCount()];
            this.geom = graph.getGeometry();
            this.weight = graph.getWeighting();
            this.consumer = consumer;
            for (int i = 0; i < flags.Length; i++)
            {
                flags[i].pathlength = 1000000000;
            }
            flags[start].pathlength = 0;
        }

        private int currid;
        /// <summary>
        /// performs one step of Djkstra algorithm
        /// </summary>
        public void calcMultiGraph()
        {
            while (true)
            {
                try
                {
                    currid = this.heap.Dequeue();
                }
                catch (Exception)
                {
                    return;
                }
                ref NodeAttributes curr = ref this.graph.getNode(currid);
                ref Flag currflag = ref this.flags[currid];
                if (currflag.pathlength > maxvalue)
                {
                    return;
                }
                if (currflag.visited)
                {
                    continue;
                }
                this.consumer.consumePoint(this.geom.getNode(currid), (int)(currflag.pathlength));
                currflag.visited = true;
                IEdgeRefStore edges = this.graph.getAdjacentEdges(currid);
                for (int i = 0; i < edges.length; i++)
                {
                    int edgeid = edges[i];
                    ref EdgeAttributes edge = ref this.graph.getEdge(edgeid);
                    int otherid = this.graph.getOtherNode(edgeid, currid, out Direction dir);
                    ref NodeAttributes other = ref this.graph.getNode(otherid);
                    ref Flag otherflag = ref this.flags[otherid];
                    if (otherflag.visited)
                    {
                        continue;
                    }
                    if (edge.oneway && dir == Direction.backward)
                    {
                        continue;
                    }
                    double newlength = currflag.pathlength + this.weight.getEdgeWeight(edgeid);
                    if (otherflag.pathlength > newlength)
                    {
                        otherflag.pathlength = newlength;
                        this.heap.Enqueue(otherid, (int)newlength);
                    }
                }
            }
        }
    }
}
