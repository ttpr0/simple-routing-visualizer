using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    class DBGraphNode : INode
    {
        private long id;
        /// <summary>
        /// IDs of adjacent GraphEdges
        /// </summary>
        private List<long> edges;
        private bool visited;
        public PointD point { get; }
        /// <summary>
        /// container for usefull attributes
        /// </summary>
        public NodeData data;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="id"></param>
        /// <param name="point">geomtric representiation (web-mercator)</param>
        public DBGraphNode(long id, PointD point)
        {
            this.id = id;
            this.edges = new List<long>();
            this.visited = false;
            this.point = point;
            this.data = new NodeData();
            this.data.pathlength = 10000000.00;
            this.data.pathlength2 = 10000000.00;
        }

        public long getID()
        {
            return this.id;
        }

        public void addGraphEdge(long edgeid)
        {
            this.edges.Add(edgeid);
        }

        public List<long> getEdges()
        {
            return this.edges;
        }

        public void setVisited(bool visited)
        {
            this.visited = visited;
        }

        public bool isVisited()
        {
            return this.visited;
        }

        public PointD getGeometry()
        {
            return this.point;
        }
    }
}
