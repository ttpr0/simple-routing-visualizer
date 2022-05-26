using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    public interface IGeometry
    {
        public Coord getNode(int node);

        public ICoordArray getEdge(int edge);

        public Coord[] getAllNodes();

        public ICoordArray[] getAllEdges();
    }
}
