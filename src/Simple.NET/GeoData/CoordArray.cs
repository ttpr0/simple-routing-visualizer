using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;
using System.Runtime.InteropServices;

namespace Simple.GeoData
{
    [StructLayout(LayoutKind.Sequential)]
    public struct CoordArray : ICoordArray
    {
        public Coord[] points;

        public CoordArray(Coord[] points)
        {
            this.points = points;
        }

        public ref Coord this[int a]
        { get { return ref points[a]; } }

        public int length
        { get { return points.Length; } }

        public IEnumerator<Coord> GetEnumerator()
        {
            return new CoordArrayEnumerator(this);
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return new CoordArrayEnumerator(this);
        }
    }
}

