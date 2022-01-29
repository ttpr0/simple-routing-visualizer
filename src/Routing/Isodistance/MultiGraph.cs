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
        private PriorityQueue<int, int> heap;
        private int startid;
        private int maxvalue;
        private BaseGraph graph;
        private IGeometry geom;
        private IWeighting weight;
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
            this.startid = start;
            this.heap = new PriorityQueue<int, int>();
            this.heap.Enqueue(this.startid, 0);
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
                Node curr = this.graph.getNode(currid);
                ref Flag currflag = ref this.flags[currid];
                if (currflag.pathlength/36 > maxvalue)
                {
                    return;
                }
                if (currflag.visited)
                {
                    continue;
                }
                points.Add(new Tuple<int,int>(currid, (int)(currflag.pathlength/36)));
                currflag.visited = true;
                int[] edges = this.graph.getAdjEdges(currid);
                for (int i = 0; i < edges.Length; i++)
                {
                    int edgeid = edges[i];
                    Edge edge = this.graph.getEdge(edgeid);
                    int otherid = this.graph.getOtherNode(edgeid, currid);
                    Node other = this.graph.getNode(otherid);
                    ref Flag otherflag = ref this.flags[otherid];
                    if (otherflag.visited)
                    {
                        continue;
                    }
                    if (edge.oneway)
                    {
                        if (edge.nodeB == currid)
                        {
                            continue;
                        }
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
