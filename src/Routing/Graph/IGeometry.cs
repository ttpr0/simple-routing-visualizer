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
        public Point getNode(int node);

        public Line getEdge(int edge);

        public Point[] getAllNodes();

        public Line[] getAllEdges();
    }
}
