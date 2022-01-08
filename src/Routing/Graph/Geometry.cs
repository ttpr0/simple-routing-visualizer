using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    class Geometry
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

        public LineD[] getLines()
        {
            return this.edgegeometry;    
        }

        public PointD[] getPoints()
        {
            return this.nodegeometry;
        }
    }
}
