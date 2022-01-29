using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    interface IGeometry
    {
        public PointD getNode(int node);

        public LineD getEdge(int edge);

        public PointD[] getAllNodes();

        public LineD[] getAllEdges();
    }
}
