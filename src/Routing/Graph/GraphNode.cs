using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    /// <summary>
    /// node of Graph
    /// </summary>
    class GraphNode : INode
    {
        private int id;
        /// <summary>
        /// adjacent GraphEdges
        /// </summary>
        private List<GraphEdge> edges;
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
        public GraphNode(int id, PointD point)
        {
            this.id = id;
            this.edges = new List<GraphEdge>();
            this.visited = false;
            this.point = point;
            this.data = new NodeData();
            this.data.pathlength = 10000000.00;
            this.data.pathlength2 = 10000000.00;
        }

        public int getID()
        {
            return this.id;
        }

        /*
        /// <summary>
        /// used to recreate path after search
        /// </summary>
        /// <param name="other"></param>
        /// <returns>Graphedge between this and other node</returns>
        public GraphEdge getEdge(GraphNode other)
        {
            foreach (GraphEdge edge in edges)
            {
                if (edge.getOtherNode(this) == other)
                {
                    return edge;
                }
            }
            return null;
        }
        */

        public void addEdge(GraphEdge way)
        {
            this.edges.Add(way);
        }

        public List<GraphEdge> getEdges()
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