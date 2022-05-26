using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.API.Routing
{
    public class RoutingRequest
    {
        public float[] start { get; set; }
        public float[] end { get; set; }
        public int key { get; set; }
        public bool drawRouting { get; set; }
        public string algorithm { get; set; }
        public int stepcount { get; set; }
    }
}
