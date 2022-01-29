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
        public PointD[] nodegeometry;
        public LineD[] edgegeometry;

        public Geometry(PointD[] points, LineD[] lines)
        {
            this.nodegeometry = points;
            this.edgegeometry = lines;
        }

        public PointD getNode(int node)
        {
            return nodegeometry[node];
        }

        public LineD getEdge(int edge)
        {
            return edgegeometry[edge];
        }

        public LineD[] getAllEdges()
        {
            return this.edgegeometry;    
        }

        public PointD[] getAllNodes()
        {
            return this.nodegeometry;
        }
    }
}
