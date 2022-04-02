using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Simple.GeoData;

namespace Simple.Routing.IsoRaster
{
    interface IProjection
    {
        ICoord proj(ICoord point);

        ICoord reproj(ICoord point);
    }
}
