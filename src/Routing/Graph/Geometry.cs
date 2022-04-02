using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    class Geometry : IGeometry
    {
        public ICoord[] nodegeometry;
        public ICoordArray[] edgegeometry;

        public Geometry(ICoord[] points, ICoordArray[] lines)
        {
            this.nodegeometry = points;
            this.edgegeometry = lines;
        }

        public ICoord getNode(int node)
        {
            return nodegeometry[node];
        }

        public ICoordArray getEdge(int edge)
        {
            return edgegeometry[edge];
        }

        public ICoordArray[] getAllEdges()
        {
            return this.edgegeometry;    
        }

        public ICoord[] getAllNodes()
        {
            return this.nodegeometry;
        }
    }
}
