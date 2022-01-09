using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;
using Simple.Routing.Graph;

namespace Simple.Routing.ShortestPath
{
    class BidirectDijkstra : IShortestPath
    {
        private PriorityQueue<Node, int> startheap;
        private PriorityQueue<Node, int> endheap;
        private Node mid;
        private Node start;
        private Node end;
        private BaseGraph graph;
        private Geometry geom;
        private Weighting weight;
        private Flag[] flags;

        private struct Flag
        {
            public double pathlength;
            public double pathlength2;
            public int prevEdge;
            public int prevEdge2;
            public bool visited = false;
            public bool visited2 = false;
        }

        public BidirectDijkstra(BaseGraph graph, int start, int end)
        {
            this.graph = graph;
            this.start = graph.getNode(start);
            this.end = graph.getNode(end);
            this.startheap = new PriorityQueue<Node, int>();
            this.startheap.Enqueue(this.start, 0);
            this.endheap = new PriorityQueue<Node, int>();
            this.endheap.Enqueue(this.end, 0);
            this.flags = new Flag[graph.nodeCount()];
            this.geom = graph.getGeometry();
            this.weight = graph.getWeighting();
            for (int i = 0; i < flags.Length; i++)
            {
                flags[i].pathlength = 1000000000;
                flags[i].pathlength2 = 1000000000;
            }
            flags[start].pathlength = 0;
            flags[end].pathlength2 = 0;
        }

        private bool finished = false;
        /// <summary>
        /// performs one step of algorithm (one step from each direction)
        /// </summary>
        /// <returns>false if shortest path found</returns>
        public bool calcShortestPath()
        {
            var s = Task.Run(() => { fromStart(); });
            var e = Task.Run(() => { fromEnd(); });
            Task.WaitAll(new[] {s,e});
            return true;
        }

        private void fromStart()
        {
            Node curr;
            while (!finished)
            {
                curr = this.startheap.Dequeue();
                ref Flag currflag = ref this.flags[curr.id];
                if (currflag.visited)
                {
                    continue;
                }
                if (currflag.visited2)
                {
                    mid = curr;
                    finished = true;
                    return;
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
                        this.startheap.Enqueue(other, (int)newlength);
                    }
                }
            }
        }

        private void fromEnd()
        {
            Node curr;
            while (!finished)
            {
                curr = this.endheap.Dequeue();
                ref Flag currflag = ref this.flags[curr.id];
                if (currflag.visited2)
                {
                    continue;
                }
                if (currflag.visited)
                {
                    mid = curr;
                    finished = true;
                    return;
                }
                currflag.visited2 = true;
                int[] edges = this.graph.getAdjEdges(curr.id);
                for (int i = 0; i < edges.Length; i++)
                {
                    Edge edge = this.graph.getEdge(edges[i]);
                    Node other = this.graph.getNode(this.graph.getOtherNode(edge.id, curr.id));
                    ref Flag otherflag = ref this.flags[other.id];
                    if (otherflag.visited2)
                    {
                        continue;
                    }
                    if (edge.oneway)
                    {
                        if (edge.nodeA == curr.id)
                        {
                            continue;
                        }
                    }
                    double newlength = currflag.pathlength2 + this.weight.getEdgeWeight(edge.id);
                    if (otherflag.pathlength2 > newlength)
                    {
                        otherflag.prevEdge2 = edge.id;
                        otherflag.pathlength2 = newlength;
                        this.endheap.Enqueue(other, (int)newlength);
                    }
                }
            }
        }

        private Node curr;
        public bool steps(int count, List<LineD> visitededges)
        {
            for (int c = 0; c < count; c++)
            {
                curr = this.startheap.Dequeue();
                ref Flag currflag = ref this.flags[curr.id];
                if (currflag.visited)
                {
                    continue;
                }
                if (currflag.visited2)
                {
                    mid = curr;
                    return false;
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
                        this.startheap.Enqueue(other, (int)newlength);
                    }
                }
                curr = this.endheap.Dequeue();
                currflag = ref this.flags[curr.id];
                if (currflag.visited2)
                {
                    continue;
                }
                if (currflag.visited)
                {
                    mid = curr;
                    return false;
                }
                currflag.visited2 = true;
                edges = this.graph.getAdjEdges(curr.id);
                for (int i = 0; i < edges.Length; i++)
                {
                    Edge edge = this.graph.getEdge(edges[i]);
                    Node other = this.graph.getNode(this.graph.getOtherNode(edge.id, curr.id));
                    ref Flag otherflag = ref this.flags[other.id];
                    if (otherflag.visited2)
                    {
                        continue;
                    }
                    if (edge.oneway)
                    {
                        if (edge.nodeA == curr.id)
                        {
                            continue;
                        }
                    }
                    visitededges.Add(this.geom.getEdge(edge.id));
                    double newlength = currflag.pathlength2 + this.weight.getEdgeWeight(edge.id);
                    if (otherflag.pathlength2 > newlength)
                    {
                        otherflag.prevEdge2 = edge.id;
                        otherflag.pathlength2 = newlength;
                        this.endheap.Enqueue(other, (int)newlength);
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
            int edge;
            curr = mid;
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
            curr = mid;
            while (true)
            {
                if (curr.id == end.id)
                {
                    break;
                }
                edge = this.flags[curr.id].prevEdge2;
                geometry.Add(this.geom.getEdge(edge));
                curr = this.graph.getNode(this.graph.getOtherNode(edge, curr.id));
            }
            return new Path(edges, geometry);
        }
    }
}
