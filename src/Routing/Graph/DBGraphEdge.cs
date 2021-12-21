using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    class DBGraphEdge : IEdge
    {
        private int id;
        private DBGraphNode node_a;
        private DBGraphNode node_b;
        private bool visited;
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
        public DBGraphEdge(int id, DBGraphNode a, DBGraphNode b, double weight, string type, bool oneway)
        {
            this.node_a = a;
            this.node_b = b;
            this.id = id;
            this.data.type = type;
            this.data.weight = weight;
            this.visited = false;
            this.data.oneway = oneway;
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

        public DBGraphNode getNodeA()
        {
            return this.node_a;
        }

        public DBGraphNode getNodeB()
        {
            return this.node_b;
        }

        public DBGraphNode getOtherNode(DBGraphNode node)
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
            return new LineD();
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
