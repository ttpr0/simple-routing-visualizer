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
    public struct Line : IEnumerable<Point>
    {
        public Point[] points;

        public Line(Point[] points)
        {
            this.points = points;
        }

        public ref Point this[int a]
        {
            get { return ref points[a]; }
        }

        public IEnumerator<Point> GetEnumerator()
        {
            return new LineEnumerator(this);
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return new LineEnumerator(this);
        }
    }

    public class LineEnumerator : IEnumerator<Point>
    {
        private readonly Line line;
        public LineEnumerator(Line line)
        {
            this.line = line;
        }

        int position = -1;

        public Point Current
        {
            get { return line[position]; }
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
            return (position < line.points.Length);
        }

        public void Reset()
        {
            this.position = -1;
        }
    }
}
