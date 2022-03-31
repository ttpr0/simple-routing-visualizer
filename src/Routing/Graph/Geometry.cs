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
        public Point[] nodegeometry;
        public Line[] edgegeometry;

        public Geometry(Point[] points, Line[] lines)
        {
            this.nodegeometry = points;
            this.edgegeometry = lines;
        }

        public Point getNode(int node)
        {
            return nodegeometry[node];
        }

        public Line getEdge(int edge)
        {
            return edgegeometry[edge];
        }

        public Line[] getAllEdges()
        {
            return this.edgegeometry;    
        }

        public Point[] getAllNodes()
        {
            return this.nodegeometry;
        }
    }
}
