using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.Routing.Graph;
using Simple.GeoData;

namespace Simple.Routing.ShortestPath
{
    class Dijkstra : IShortestPath
    {
        private PriorityQueue<Node, int> heap;
        private Node end;
        private Node start;
        private BaseGraph graph;
        private Geometry geom;
        private Weighting weight;
        private Flag[] flags;

        private struct Flag
        {
            public double pathlength = 1000000000;
            public int prevEdge;
            public bool visited = false;
        }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="start">startnode</param>
        /// <param name="end">endnode</param>
        public Dijkstra(BaseGraph graph, int start, int end)
        {
            this.graph = graph;
            this.end = this.graph.getNode(end);
            this.start = this.graph.getNode(start);
            this.heap = new PriorityQueue<Node, int>();
            this.heap.Enqueue(this.start, 0);
            this.flags = new Flag[graph.nodeCount()];
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
        /// <returns>false if shortest path is found</returns>
        public bool calcShortestPath()
        {
            while (true)
            {
                try
                {
                    curr = this.heap.Dequeue();
                }
                catch (Exception)
                {
                    return false;
                }
                if (curr.id == end.id)
                {
                    return true;
                }
                ref Flag currflag = ref this.flags[curr.id];
                if (currflag.visited)
                {
                    continue;
                }
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
                        otherflag.prevEdge = edge.id;
                        otherflag.pathlength = newlength;
                        this.heap.Enqueue(other, (int)newlength);
                    }
                }
            }
        }

        public bool steps(int count, List<LineD> visitededges)
        {
            for (int c = 0; c < count; c++)
            {
                curr = this.heap.Dequeue();
                if (curr.id == end.id)
                {
                    return false;
                }
                ref Flag currflag = ref this.flags[curr.id];
                if (currflag.visited)
                {
                    continue;
                }
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
                    visitededges.Add(this.geom.getEdge(edge.id));
                    double newlength = currflag.pathlength + this.weight.getEdgeWeight(edge.id);
                    if (otherflag.pathlength > newlength)
                    {
                        otherflag.prevEdge = edge.id;
                        otherflag.pathlength = newlength;
                        this.heap.Enqueue(other, (int)newlength);
                    }
                }
            }
            return true;
        }

        /// <summary>
        /// use only after path finsing finished
        /// </summary>
        /// <returns>list of LineD representing shortest path</returns>
        public Path getShortestPath()
        {
            List<LineD> geometry = new List<LineD>();
            List<int> edges = new List<int>();
            curr = end;
            int edge;
            while (true)
            {
                if (curr.id == start.id)
                {
                    break;
                }
                edge = this.flags[curr.id].prevEdge;
                geometry.Add(this.geom.getEdge(edge));
                curr = this.graph.getNode(this.graph.getOtherNode(edge, curr.id));
            }
            return new Path(edges, geometry);
        }
    }
}
