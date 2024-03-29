﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.Routing.Graph;
using Simple.GeoData;

namespace Simple.Routing.ShortestPath
{
    public class Dijkstra : IShortestPath
    {
        private PriorityQueue<int, int> heap;
        private int endid;
        private int startid;
        private IGraph graph;
        private IGeometry geom;
        private IWeighting weight;
        private Flag[] flags;

        private struct Flag
        {
            public double pathlength;
            public int prevEdge;
            public bool visited;
        }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="start">startnode</param>
        /// <param name="end">endnode</param>
        public Dijkstra(IGraph graph, int start, int end)
        {
            this.graph = graph;
            this.endid = end;
            this.startid = start;
            this.heap = new PriorityQueue<int, int>();
            this.heap.Enqueue(this.startid, 0);
            this.flags = new Flag[graph.nodeCount()];
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
        /// <returns>false if shortest path is found</returns>
        public bool calcShortestPath()
        {
            while (true)
            {
                try
                {
                    currid = this.heap.Dequeue();
                }
                catch (Exception)
                {
                    return false;
                }
                if (currid == endid)
                {
                    return true;
                }
                ref NodeAttributes curr = ref this.graph.getNode(currid);
                ref Flag currflag = ref this.flags[currid];
                if (currflag.visited)
                {
                    continue;
                }
                currflag.visited = true;
                IEdgeRefStore edges = this.graph.getAdjacentEdges(currid);
                for (int i=0; i<edges.length; i++)
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
                        this.heap.Enqueue(otherid, (int)newlength);
                    }
                }
            }
        }

        public bool steps(int count, List<ICoordArray> visitededges)
        {
            for (int c = 0; c < count; c++)
            {
                currid = this.heap.Dequeue();
                if (currid == endid)
                {
                    return false;
                }
                NodeAttributes curr = this.graph.getNode(currid);
                ref Flag currflag = ref this.flags[currid];
                if (currflag.visited)
                {
                    continue;
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
                        this.heap.Enqueue(otherid, (int)newlength);
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
            currid = endid;
            int edge;
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
            path.Reverse();
            return new Path(this.graph, path);
        }
    }
}
