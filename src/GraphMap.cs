using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using RoutingVisualizer.NavigationGraph;

namespace RoutingVisualizer
{
    class GraphMap : MapInterface
    {
        private Bitmap map;
        private List<GraphEdge> edges;
        private Graphics g;

        public GraphMap(int width, int height, Graph graph)
        {
            this.map = new Bitmap(width, height);
            this.edges = graph.getGraphEdges();
            this.g = Graphics.FromImage(this.map);
        }

        private Pen visitedpen = new Pen(Color.MediumVioletRed, 2);
        private PointD upperleft;
        public Bitmap createMap(PointD upperleft, int zoom)
        {
            double tilesize = 40075016.69 / Math.Pow(2, zoom);
            this.upperleft = upperleft;
            foreach (GraphEdge edge in edges)
            {
                if (edge.isVisited() && !edge.data.drawn)
                {
                    Point[] points = new Point[edge.line.points.Length];
                    for (int j = 0; j < edge.line.points.Length; j++)
                    {
                        points[j] = realToScreen(edge.line.points[j], tilesize);
                    }
                    g.DrawLines(visitedpen, points);
                    edge.data.drawn = true;
                }
            }
            return this.map;
        }

        public void clearMap()
        {
            g.Clear(Color.Transparent);
        }

        private Point realToScreen(PointD point, double tilesize)
        {
            double x = (point.X - upperleft.X) * 256 / tilesize;
            double y = -(point.Y - upperleft.Y) * 256 / tilesize;
            return new Point((int)x, (int)y);
        }
    }
}
