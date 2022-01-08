using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.Routing.Graph;
using Simple.GeoData;

namespace Simple.Routing.ShortestPath
{
    class AStar2 : IShortestPath
    {
        private SortedDictionary<double, int> visited;
        private BaseGraph graph;
        private Flag[] flags;
        private Node start;
        private Node end;
        private PointD endpoint;
        private Geometry geom;
        private Weighting weight;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="start">startnode</param>
        /// <param name="end">endnode</param>
        public AStar2(BaseGraph graph, int start, int end)
        {
            this.graph = graph;
            this.end = graph.getNode(end);
            this.start = graph.getNode(start);
            this.visited = new SortedDictionary<double, int>();
            this.visited.Add(0, start);
            this.flags = new Flag[graph.nodeCount()];
            this.geom = graph.getGeometry();
            this.weight = graph.getWeighting();
            this.endpoint = geom.getNode(end);
            for (int i=0; i<flags.Length; i++)
            {
                flags[i].pathlength = 1000000000;
            }
            flags[start].pathlength = 0;
        }

        private Node curr;
        private double currdis;
        /// <summary>
        /// performs one step of A* algorithm,
        /// sets visited GraphEdges to visited
        /// </summary>
        /// <returns>false if shortest path is found</returns>
        public bool calcShortestPath()
        {
            while (true)
            {
                try
                {
                    currdis = visited.Keys.First();
                    curr = this.graph.getNode(visited[currdis]);
                }
                catch (Exception)
                {
                    return false;
                }
                if (curr.id == end.id)
                {
                    return true;
                }
                ref Flag flag = ref this.flags[curr.id];
                flag.visited = true;
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
                    otherflag.distance = Distance.euclideanDistance(this.geom.getNode(other.id), endpoint);
                    double newlength = flag.pathlength - flag.distance + this.weight.getEdgeWeight(edge.id) + otherflag.distance;
                    if (otherflag.pathlength > newlength)
                    {
                        if (otherflag.pathlength < 1000000000)
                        {
                            visited.Remove(otherflag.pathlength);
                        }
                        otherflag.prevEdge = edge.id;
                        newlength = addToVisited(newlength, other.id);
                        otherflag.pathlength = newlength;
                    }
                }
                visited.Remove(currdis);
            }
        }

        public bool steps(int count, List<LineD> visitededges)
        {
            for (int c = 0; c < count; c++)
            {
                currdis = visited.Keys.First();
                curr = this.graph.getNode(visited[currdis]);
                if (curr.id == end.id)
                {
                    return false;
                }
                ref Flag flag = ref this.flags[curr.id];
                flag.visited = true;
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
                    otherflag.distance = Distance.euclideanDistance(this.geom.getNode(other.id), endpoint);
                    double newlength = flag.pathlength - flag.distance + this.weight.getEdgeWeight(edge.id) + otherflag.distance;
                    if (otherflag.pathlength > newlength)
                    {
                        if (otherflag.pathlength < 1000000000)
                        {
                            visited.Remove(otherflag.pathlength);
                        }
                        otherflag.prevEdge = edge.id;
                        newlength = addToVisited(newlength, other.id);
                        otherflag.pathlength = newlength;
                    }
                }
                visited.Remove(currdis);
            }
            return true;
        }

        /// <summary>
        /// function to avoid similar entries in dict
        /// </summary>
        /// <param name="newkey">key/pathlength of visited node</param>
        /// <param name="newnode">visited node</param>
        /// <returns>entry to dict, might differ from newkey param</returns>
        private double addToVisited(double newkey, int newnode)
        {
            try
            {
                visited.Add(newkey, newnode);
                return newkey;
            }
            catch (Exception)
            {
                return addToVisited(newkey + 0.00001, newnode);
            }
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

    struct Flag
    {
        public double pathlength = 1000000000;
        public int prevEdge;
        public double distance;
        public bool visited = false;
    }
}
