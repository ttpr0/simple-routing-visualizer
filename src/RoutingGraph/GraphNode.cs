using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    class GraphNode
    {
        private long id;
        private List<GraphEdge> edges;
        private bool visited;
        public PointD point { get; }
        public NodeData data;

        public GraphNode(long id, PointD point)
        {
            this.id = id;
            this.edges = new List<GraphEdge>();
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

        public void addGraphEdge(GraphEdge way)
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

    struct NodeData
    {
        public double pathlength;
        public GraphEdge prevEdge;
        public double pathlength2;
        public GraphEdge prevEdge2;
        public double distance;
        public double distance2;
    }
}
