﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.Routing.Graph
{
    public interface IWeighting
    {
        public int getEdgeWeight(int edge);

        public int getTurnCost(int from, int via, int to);
    }
}
