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

        public ICoord this[int a]
        { get { return points[a]; } }

        public float this[int a, int b]
        {
            get { return points[a][b]; }
            set { points[a][b] = value; }
        }

        public int length
        { get { return points.Length; } }

        public IEnumerator<ICoord> GetEnumerator()
        {
            return new CoordArrayEnumerator(this);
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return new CoordArrayEnumerator(this);
        }
    }
}

