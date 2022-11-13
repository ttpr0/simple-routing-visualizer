using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    public interface ICoordArray : IEnumerable<Coord>
    {
        public ref Coord this[int a] { get; }

        public int length { get; }
    }
}
