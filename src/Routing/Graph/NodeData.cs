﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    struct NodeData
    {
        public double pathlength;
        public IEdge prevEdge;
        public double pathlength2;
        public IEdge prevEdge2;
        public double distance;
        public double distance2;
    }
}
