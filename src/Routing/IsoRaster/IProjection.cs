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
        void proj(ref Point point);

        void reproj(ref Point point);
    }
}
