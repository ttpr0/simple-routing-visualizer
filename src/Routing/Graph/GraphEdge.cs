using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    /// <summary>
    /// edge of Graph
    /// </summary>
    [Obsolete]
    class GraphEdge : IEdge
    {
        private int id;
        private GraphNode node_a;
        private GraphNode node_b;
        /// <summary>
        /// geometric representation
        /// </summary>
        public LineD line { get; }
        private bool visited;
        /// <summary>
        /// container for attributes
        /// </summary>
        public EdgeData data;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="id"></param>
        /// <param name="line"></param>
        /// <param name="a"></param>
        /// <param name="b"></param>
        /// <param name="type">string representing type of street (osm-type), used to compute weight</param>
        /// <param name="oneway">true if oneway from a to b</param>
        public GraphEdge(int id, LineD line, GraphNode a, GraphNode b, string type, bool oneway)
        {
            this.node_a = a;
            this.node_b = b;
            this.id = id;
            this.line = line;
            this.data.type = type;
            this.data.weight = 0;
            this.visited = false;
            this.data.oneway = oneway;
            for (int i = 0; i < this.line.points.Length -1; i++)
            {
                this.data.weight += Math.Sqrt(Math.Pow(this.line.points[i + 1].X - this.line.points[i].X, 2) + Math.Pow(this.line.points[i + 1].Y - this.line.points[i].Y, 2));
            }
            if (type == "motorway" || type == "trunk" || type == "motorway_link" || type == "trunk_link")
            {
                this.data.weight *= 1;
                this.data.important = true;
            }
            else if (type == "tertiary" || type == "secondary" || type == "primary" || type == "tertiary_link" || type == "secondary_link" || type == "primary_link")
            {
                this.data.weight *= 1.5;
                this.data.important = true;
            }
            else if (type == "residential" || type == "road" || type == "living_street" || type == "track" || type == "service")
            {
                this.data.weight *= 2.5;
                this.data.important = false;
            }
            else
            {
                this.data.weight *= 10;
                this.data.important = false;
            }
        }

        public GraphEdge(int id, LineD line, GraphNode a, GraphNode b, double weight, string type, bool oneway)
        {
            this.node_a = a;
            this.node_b = b;
            this.id = id;
            this.line = line;
            this.data.type = type;
            this.data.weight = weight;
            this.visited = false;
            this.data.oneway = oneway;
            if (type == "motorway" || type == "trunk" || type == "motorway_link" || type == "trunk_link" || type == "tertiary" || type == "secondary" || type == "primary" || type == "tertiary_link" || type == "secondary_link" || type == "primary_link")
            {
                this.data.important = true;
            }
            else
            {
                this.data.important = false;
            }
        }

        public int getID()
        {
            return this.id;
        }

        public GraphNode getNodeA()
        {
            return this.node_a;
        }

        public void setNodeA(GraphNode start)
        {
            this.node_a = start;
        }

        public GraphNode getNodeB()
        {
            return this.node_b;
        }

        public void setNodeB(GraphNode end)
        {
            this.node_b = end;
        }

        public GraphNode getOtherNode(GraphNode node)
        {
            if (node.getID() == node_a.getID())
            {
                return node_b;
            }
            if (node.getID() == node_b.getID())
            {
                return node_a;
            }
            return null;
        }

        public string getType()
        {
            return this.data.type;
        }

        public LineD getGeometry()
        {
            return this.line;
        }

        public double getWeight()
        {
            return this.data.weight;
        }

        public void setVisited(bool visited)
        {
            this.visited = visited;
        }

        public bool isVisited()
        {
            return this.visited;
        }
    }
}
