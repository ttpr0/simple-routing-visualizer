using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.Routing.Graph;
using Simple.GeoData;

namespace Simple.Routing.Isodistance
{
    class MultiGraph
    {
        private PriorityQueue<Node, int> heap;
        private Node start;
        private int maxvalue;
        private BaseGraph graph;
        private Geometry geom;
        private Weighting weight;
        private Flag[] flags;
        private List<Tuple<int,int>> points;

        private struct Flag
        {
            public double pathlength = 1000000000;
            public bool visited = false;
        }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="start">startnode</param>
        /// <param name="end">endnode</param>
        public MultiGraph(BaseGraph graph, int start, int maxvalue)
        {
            this.graph = graph;
            this.maxvalue = maxvalue;
            this.start = this.graph.getNode(start);
            this.heap = new PriorityQueue<Node, int>();
            this.heap.Enqueue(this.start, 0);
            this.flags = new Flag[graph.nodeCount()];
            this.points = new List<Tuple<int,int>>();
            this.geom = graph.getGeometry();
            this.weight = graph.getWeighting();
            for (int i = 0; i < flags.Length; i++)
            {
                flags[i].pathlength = 1000000000;
            }
            flags[start].pathlength = 0;
        }

        private Node curr;
        /// <summary>
        /// performs one step of Djkstra algorithm
        /// </summary>
        public void calcMultiGraph()
        {
            while (true)
            {
                try
                {
                    curr = this.heap.Dequeue();
                }
                catch (Exception)
                {
                    return;
                }
                ref Flag currflag = ref this.flags[curr.id];
                if (currflag.pathlength/36 > maxvalue)
                {
                    return;
                }
                if (currflag.visited)
                {
                    continue;
                }
                points.Add(new Tuple<int,int>(curr.id, (int)(currflag.pathlength/36)));
                currflag.visited = true;
                int[] edges = this.graph.getAdjEdges(curr.id);
                for (int i = 0; i < edges.Length; i++)
                {
                    Edge edge = this.graph.getEdge(edges[i]);
                    Node other = this.graph.getNode(this.graph.getOtherNode(edge.id, curr.id));
                    ref Flag otherflag = ref this.flags[other.id];
                    if (otherflag.visited)
                    {
                        continue;
                    }
                    if (edge.oneway)
                    {
                        if (edge.nodeB == curr.id)
                        {
                            continue;
                        }
                    }
                    double newlength = currflag.pathlength + this.weight.getEdgeWeight(edge.id);
                    if (otherflag.pathlength > newlength)
                    {
                        otherflag.pathlength = newlength;
                        this.heap.Enqueue(other, (int)newlength);
                    }
                }
            }
        }

        /// <summary>
        /// use only after path finsing finished
        /// </summary>
        /// <returns>list of LineD representing shortest path</returns>
        public PointCloudD getMultiGraph()
        {
            ValuePointD[] vpoints = new ValuePointD[points.Count];
            for (int i = 0; i < points.Count; i++)
            {
                vpoints[i] = new ValuePointD(this.geom.getNode(points[i].Item1), points[i].Item2);
            }
            return new PointCloudD(vpoints);
        }
    }
}
