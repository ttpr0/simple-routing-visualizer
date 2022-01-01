﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;
using Simple.Routing.ShortestPath;

namespace Simple.Maps
{
    /// <summary>
    /// Container containing geometries (web-mercator coordinates)
    /// </summary>
    class GeometryContainer
    {
        public PointD startnode;
        public PointD endnode;
        public Path path;
    }
}