using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.NavigationGraph
{
    interface ShortestPathInterface
    {
        public bool step();
        public List<LineD> getShortestPath();
    }
}
