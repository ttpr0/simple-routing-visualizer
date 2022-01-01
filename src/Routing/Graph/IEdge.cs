﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.Graph
{
    interface IEdge
    {
        public int getID();

        public string getType();

        public LineD getGeometry();

        public double getWeight();

        public void setVisited(bool visited);

        public bool isVisited();
    }
}