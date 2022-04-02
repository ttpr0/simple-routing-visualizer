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
        public ICoord getNode(int node);

        public ICoordArray getEdge(int edge);

        public ICoord[] getAllNodes();

        public ICoordArray[] getAllEdges();
    }
}
