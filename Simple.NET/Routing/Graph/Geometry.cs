using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    public class Geometry : IGeometry
    {
        public Coord[] nodegeometry;
        public ICoordArray[] edgegeometry;

        public Geometry(Coord[] points, ICoordArray[] lines)
        {
            this.nodegeometry = points;
            this.edgegeometry = lines;
        }

        public Coord getNode(int node)
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

        public Coord[] getAllNodes()
        {
            return this.nodegeometry;
        }
    }
}
