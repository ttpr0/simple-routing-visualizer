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
    public struct Polygon : IEnumerable<Line>
    {
        public Line[] lines;

        public Polygon(Line[] lines)
        {
            this.lines = lines;
        }

        public ref Line this[int a]
        {
            get { return ref lines[a]; }
        }

        public IEnumerator<Line> GetEnumerator()
        {
            return new PolygonEnumerator(this);
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return new PolygonEnumerator(this);
        }
    }

    public class PolygonEnumerator : IEnumerator<Line>
    {
        private readonly Polygon polygon;
        public PolygonEnumerator(Polygon polygon)
        {
            this.polygon = polygon;
        }

        int position = -1;

        public Line Current
        {
            get { return polygon[position]; }
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
            return (position < polygon.lines.Length);
        }

        public void Reset()
        {
            this.position = -1;
        }
    }
}

