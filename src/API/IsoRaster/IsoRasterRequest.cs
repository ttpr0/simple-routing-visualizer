using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.API.IsoRaster
{
    public class IsoRasterRequest
    {
        public float[][] locations { get; set; }
        public int range { get; set; }
        public int precession { get; set; }

        public bool isvalid { get { return true; } }
    }
}
