using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace RoutingVisualizer
{
    class UtilityMap : MapInterface
    {
        private Bitmap map;
        private Graphics g;
        public GeomentryContainer container { get; }

        public UtilityMap(int width, int height, GeomentryContainer container)
        {
            this.container = container;
            this.map = new Bitmap(width, height);
            this.g = Graphics.FromImage(this.map);
        }

        private Pen pathpen = new Pen(Color.BlueViolet, 4);
        private Pen startpen = new Pen(Color.Red, 2);
        private Pen finishpen = new Pen(Color.Blue, 2);
        private PointD upperleft;
        public Bitmap createMap(PointD upperleft, int zoom)
        {
            g.Clear(Color.Transparent);
            double tilesize = 40075016.69 / Math.Pow(2, zoom);
            this.upperleft = upperleft;
            if (container.path != null)
            {
                foreach (LineD line in container.path)
                {
                    Point[] points = new Point[line.points.Length];
                    for (int j = 0; j < line.points.Length; j++)
                    {
                        points[j] = realToScreen(line.points[j], tilesize);
                    }
                    g.DrawLines(pathpen, points);
                }
            }
            Point startpoint = realToScreen(container.startnode, tilesize);
            g.DrawEllipse(startpen, new Rectangle(startpoint.X - 5, startpoint.Y - 5, 10, 10));
            Point endpoint = realToScreen(container.endnode, tilesize);
            g.DrawEllipse(finishpen, new Rectangle(endpoint.X - 5, endpoint.Y - 5, 10, 10));
            return this.map;
        }

        private Point realToScreen(PointD point, double tilesize)
        {
            double x = (point.X - upperleft.X) * 256 / tilesize;
            double y = -(point.Y - upperleft.Y) * 256 / tilesize;
            return new Point((int)x, (int)y);
        }
    }

    class GeomentryContainer
    {
        public PointD startnode;
        public PointD endnode;
        public List<LineD> path;
    }
}
