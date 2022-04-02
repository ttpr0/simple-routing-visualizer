using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    public interface ICoord : IEnumerable<float>
    {
        public float this[int a] { get; set; }
    }
}