using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;
using System.Runtime.InteropServices;

namespace Simple.GeoData
{
    public class CoordEnumerator : IEnumerator<float>
    {
        private readonly Coord point;
        public CoordEnumerator(Coord point)
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
