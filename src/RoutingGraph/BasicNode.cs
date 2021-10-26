using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    class BasicNode : INode
    {
        private int id;
        private bool visited;
        private List<int> edges;
        public PointD point { get; }
        public NodeData data;

        public BasicNode(int id, PointD point)
        {
            this.id = id;
            this.point = point;
            this.visited = false;
            this.edges = new List<int>();
            this.data = new NodeData();
            this.data.pathlength = 10000000.00;
            this.data.pathlength2 = 10000000.00;
        }

        public int getID()
        {
            return this.id;
        }

        public void setVisited(bool visited)
        {
            this.visited = visited;
        }

        public bool isVisited()
        {
            return this.visited;
        }

        public void addEdge(int edgeid)
        {
            this.edges.Add(edgeid);
        }

        public List<int> getEdges()
        {
            return this.edges;
        }
    }
}
