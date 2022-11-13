using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace Simple.GeoData
{
    [StructLayout(LayoutKind.Sequential)]
    public unsafe struct Coord : IEnumerable<float>
    {
        public fixed float coords[2];

        public Coord(float lon, float lat)
        {
            this.coords[0] = lon;
            this.coords[1] = lat;
        }

        public float this[int a]
        {
            get { return coords[a]; }
            set { coords[a] = value; }
        }

        public IEnumerator<float> GetEnumerator()
        {
            return new CoordEnumerator(this);
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return new CoordEnumerator(this);
        }
    }
}
