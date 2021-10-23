using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    interface IEdge
    {
        LineD getGeometry();
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
