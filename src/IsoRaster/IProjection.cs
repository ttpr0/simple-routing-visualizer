using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace RoutingVisualizer.IsoRaster
{
    public interface IProjection
    {
        Coord proj(Coord point);

        Coord reproj(Coord point);
    }
}
