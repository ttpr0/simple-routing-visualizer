using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;
using System.Runtime.InteropServices;

namespace Simple.GeoData
{
    public class CoordArrayEnumerator : IEnumerator<ICoord>
    {
        private readonly ICoordArray arr;
        public CoordArrayEnumerator(ICoordArray arr)
        {
            this.arr = arr;
        }

        int position = -1;

        public ICoord Current
        {
            get { return new Coord(arr[position,0], arr[position,1]); }
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
            return (position < arr.length);
        }

        public void Reset()
        {
            this.position = -1;
        }
    }
}