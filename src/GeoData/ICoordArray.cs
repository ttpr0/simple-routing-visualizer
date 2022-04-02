using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    public interface ICoordArray : IEnumerable<ICoord>
    {
        public ICoord this[int a] { get; }

        public float this[int a, int b] { get; set; }

        public int length { get; }
    }
}
