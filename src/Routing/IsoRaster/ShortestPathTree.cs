using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.Routing.Graph;
using Simple.GeoData;

namespace Simple.Routing.IsoRaster
{
    class ShortestPathTree
    {
        private PriorityQueue<int, int> heap;
        private int startid;
        private int maxvalue;
        private IGraph graph;
        private IGeometry geom;
        private IWeighting weight;
        private Flag[] flags;
        private QuadTree points;
        private IRasterizer rasterizer;

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
        public ShortestPathTree(IGraph graph, int start, int maxvalue, IRasterizer rasterizer)
        {
            this.graph = graph;
            this.maxvalue = maxvalue;
            this.startid = start;
            this.heap = new PriorityQueue<int, int>();
            this.heap.Enqueue(this.startid, 0);
            this.flags = new Flag[graph.nodeCount()];
            this.points = new QuadTree();
            this.geom = graph.getGeometry();
            this.weight = graph.getWeighting();
            this.rasterizer = rasterizer;
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
                (int x, int y) = rasterizer.pointToIndex(this.geom.getNode(currid));
                points.insert(x, y, (int)(currflag.pathlength));
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

        /// <summary>
        /// use only after path finsing finished
        /// </summary>
        /// <returns>list of LineD representing shortest path</returns>
        public PointCloudD getPointCloud()
        {
            List<QuadNode> nodes = this.points.toList();
            ValuePointD[] vpoints = new ValuePointD[nodes.Count];
            //for (int i = 0; i < nodes.Count; i++)
            //{
            //    vpoints[i] = new ValuePointD(this.rasterizer.indexToPoint(nodes[i].x, nodes[i].y), nodes[i].value);
            //}
            return new PointCloudD(vpoints);
        }

        public GeoJsonPolygon[] getIsoRaster()
        {
            List<QuadNode> nodes = this.points.toList();
            GeoJsonPolygon[] poly = new GeoJsonPolygon[nodes.Count];
            for (int i = 0; i < nodes.Count; i++)
            {
                ICoord ul = this.rasterizer.indexToPoint(nodes[i].x, nodes[i].y);
                ICoord lr = this.rasterizer.indexToPoint(nodes[i].x + 1, nodes[i].y + 1);
                ICoordArray line = new CoordArray(new Coord[5]);
                line[0,0] = ul[0];
                line[0,1] = ul[1];
                line[1,0] = lr[0];
                line[1,1] = ul[1];
                line[2,0] = lr[0];
                line[2,1] = lr[1];
                line[3,0] = ul[0];
                line[3,1] = lr[1];
                line[4,0] = ul[0];
                line[4,1] = ul[1];
                poly[i] = new GeoJsonPolygon(new ICoordArray[1] { line }, nodes[i].value);
            }
            return poly;
        }
    }
}
