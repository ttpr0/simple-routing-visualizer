using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    interface IEdge
    {
        public int getID();

        public string getType();

        public LineD getGeometry();

        public double getWeight();

        public void setVisited(bool visited);

        public bool isVisited();
    }

    struct EdgeData
    {
        public bool drawn;
        public bool oneway;
        public double weight;
        public string type;
        public bool important;
    }
}
