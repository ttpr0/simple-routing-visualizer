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
        private PriorityQueue<int, int> startheap;
        private PriorityQueue<int, int> endheap;
        private int midid;
        private int startid;
        private int endid;
        private IGraph graph;
        private IGeometry geom;
        private IWeighting weight;
        private Flag[] flags;

        private struct Flag
        {
            public double pathlength;
            public double pathlength2;
            public int prevEdge;
            public int prevEdge2;
            public bool visited;
            public bool visited2;
        }

        public BidirectDijkstra(IGraph graph, int start, int end)
        {
            this.graph = graph;
            this.startid = start;
            this.endid = end;
            this.startheap = new PriorityQueue<int, int>();
            this.startheap.Enqueue(this.startid, 0);
            this.endheap = new PriorityQueue<int, int>();
            this.endheap.Enqueue(this.endid, 0);
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
            int currid;
            while (!finished)
            {
                currid = this.startheap.Dequeue();
                ref NodeAttributes curr = ref this.graph.getNode(currid);
                ref Flag currflag = ref this.flags[currid];
                if (currflag.visited)
                {
                    continue;
                }
                if (currflag.visited2)
                {
                    midid = currid;
                    finished = true;
                    return;
                }
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
                        otherflag.prevEdge = edgeid;
                        otherflag.pathlength = newlength;
                        this.startheap.Enqueue(otherid, (int)newlength);
                    }
                }
            }
        }

        private void fromEnd()
        {
            int currid;
            while (!finished)
            {
                currid = this.endheap.Dequeue();
                ref NodeAttributes curr = ref this.graph.getNode(currid);
                ref Flag currflag = ref this.flags[currid];
                if (currflag.visited2)
                {
                    continue;
                }
                if (currflag.visited)
                {
                    midid = currid;
                    finished = true;
                    return;
                }
                currflag.visited2 = true;
                IEdgeRefStore edges = this.graph.getAdjacentEdges(currid);
                for (int i = 0; i < edges.length; i++)
                {
                    int edgeid = edges[i];
                    ref EdgeAttributes edge = ref this.graph.getEdge(edgeid);
                    int otherid = this.graph.getOtherNode(edgeid, currid, out Direction dir);
                    ref NodeAttributes other = ref this.graph.getNode(otherid);
                    ref Flag otherflag = ref this.flags[otherid];
                    if (otherflag.visited2)
                    {
                        continue;
                    }
                    if (edge.oneway && dir == Direction.forward)
                    {
                        continue;
                    }
                    double newlength = currflag.pathlength2 + this.weight.getEdgeWeight(edgeid);
                    if (otherflag.pathlength2 > newlength)
                    {
                        otherflag.prevEdge2 = edgeid;
                        otherflag.pathlength2 = newlength;
                        this.endheap.Enqueue(otherid, (int)newlength);
                    }
                }
            }
        }

        private int currid;
        public bool steps(int count, List<ICoordArray> visitededges)
        {
            for (int c = 0; c < count; c++)
            {
                currid = this.startheap.Dequeue();
                ref NodeAttributes curr = ref this.graph.getNode(currid);
                ref Flag currflag = ref this.flags[currid];
                if (currflag.visited)
                {
                    continue;
                }
                if (currflag.visited2)
                {
                    midid = currid;
                    return false;
                }
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
                    visitededges.Add(this.geom.getEdge(edgeid));
                    double newlength = currflag.pathlength + this.weight.getEdgeWeight(edgeid);
                    if (otherflag.pathlength > newlength)
                    {
                        otherflag.prevEdge = edgeid;
                        otherflag.pathlength = newlength;
                        this.startheap.Enqueue(otherid, (int)newlength);
                    }
                }
                currid = this.endheap.Dequeue();
                curr = ref this.graph.getNode(currid);
                currflag = ref this.flags[currid];
                if (currflag.visited2)
                {
                    continue;
                }
                if (currflag.visited)
                {
                    midid = currid;
                    return false;
                }
                currflag.visited2 = true;
                edges = this.graph.getAdjacentEdges(currid);
                for (int i = 0; i < edges.length; i++)
                {
                    int edgeid = edges[i];
                    ref EdgeAttributes edge = ref this.graph.getEdge(edgeid);
                    int otherid = this.graph.getOtherNode(edgeid, currid, out Direction dir);
                    ref NodeAttributes other = ref this.graph.getNode(otherid);
                    ref Flag otherflag = ref this.flags[otherid];
                    if (otherflag.visited2)
                    {
                        continue;
                    }
                    if (edge.oneway && dir == Direction.forward)
                    {
                        continue;
                    }
                    visitededges.Add(this.geom.getEdge(edgeid));
                    double newlength = currflag.pathlength2 + this.weight.getEdgeWeight(edgeid);
                    if (otherflag.pathlength2 > newlength)
                    {
                        otherflag.prevEdge2 = edgeid;
                        otherflag.pathlength2 = newlength;
                        this.endheap.Enqueue(otherid, (int)newlength);
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
            List<int> path = new List<int>();
            int edge;
            currid = midid;
            while (true)
            {
                path.Add(currid);
                if (currid == startid)
                {
                    break;
                }
                edge = this.flags[currid].prevEdge;
                path.Add(edge);
                currid = this.graph.getOtherNode(edge, currid, out Direction _);
            }
            path.RemoveAt(0);
            path.Reverse();
            currid = midid;
            while (true)
            {
                path.Add(currid);
                if (currid == endid)
                {
                    break;
                }
                edge = this.flags[currid].prevEdge2;
                path.Add(edge);
                currid = this.graph.getOtherNode(edge, currid, out Direction _);
            }
            return new Path(this.graph, path);
        }
    }
}
