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
    public unsafe struct Point : IEnumerable<float>
    {
        public fixed float coords[2];

        public Point(float lon, float lat)
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
            return new PointEnumerator(this);
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return new PointEnumerator(this);
        }
    }

    public class PointEnumerator : IEnumerator<float>
    {
        private readonly Point point;
        public PointEnumerator(Point point)
        {
            this.point = point;
        }

        int position = -1;

        public float Current
        {
            get { return point[position]; }
        }

        object IEnumerator.Current
        {
            get { return Current; }
        }

        public void Dispose()
        {
        }

        public bool MoveNext()
        {
            position++;
            return (position < 2);
        }

        public void Reset()
        {
            this.position = -1;
        }
    }
}
