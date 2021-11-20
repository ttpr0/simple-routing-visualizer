using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    class BasicEdge : IEdge
    {
        private int id;
        private int node_a;
        private int node_b;
        private bool visited;
        public LineD line { get; }
        /// <summary>
        /// container for attributes
        /// </summary>
        public EdgeData data;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="id"></param>
        /// <param name="a"></param>
        /// <param name="b"></param>
        /// <param name="type">string representing type of street (osm-type), used to compute weight</param>
        /// <param name="oneway">true if oneway from a to b</param>
        public BasicEdge(int id, LineD line, int a, int b, double weight, string type, bool oneway)
        {
            this.node_a = a;
            this.node_b = b;
            this.id = id;
            this.line = line;
            this.data.type = type;
            this.data.weight = weight;
            this.visited = false;
            this.data.oneway = oneway;
            this.data.drawn = false;
            if (type == "motorway" || type == "trunk" || type == "motorway_link" || type == "trunk_link")
            {
                this.data.important = true;
            }
            else if (type == "tertiary" || type == "secondary" || type == "primary" || type == "tertiary_link" || type == "secondary_link" || type == "primary_link")
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

        public int getNodeA()
        {
            return this.node_a;
        }

        public int getNodeB()
        {
            return this.node_b;
        }

        public int getOtherNode(int nodeid)
        {
            if (nodeid == node_a)
            {
                return node_b;
            }
            if (nodeid == node_b)
            {
                return node_a;
            }
            return 0;
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

