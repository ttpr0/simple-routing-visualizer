using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;
using Simple.Routing.ShortestPath;
using Simple.Routing.Graph;

namespace Simple.Maps
{
    /// <summary>
    /// Container containing geometries (web-mercator coordinates)
    /// </summary>
    class GeometryContainer
    {
        public Coord startnode;
        public Coord endnode;
        public Path path;
        public PointCloudD valuepoints;
        public ICoordArray[] polygon;
        //public RasterImage mgimg;
        public TrafficTable traffic;
        public IGeometry geom;
    }
}
