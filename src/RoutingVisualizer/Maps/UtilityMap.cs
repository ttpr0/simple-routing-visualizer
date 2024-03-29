﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.Drawing.Imaging;
using Simple.GeoData;

namespace Simple.Maps
{
    /// <summary>
    /// Map used to draw objects from GeometryContainer
    /// </summary>
    class UtilityMap : IMap
    {
        private Bitmap map;
        private Graphics g;
        public GeometryContainer container { get; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="width">width of Bitmap</param>
        /// <param name="height">height of Bitmap</param>
        /// <param name="container">Container containing objects to be drawn</param>
        public UtilityMap(int width, int height, GeometryContainer container)
        {
            this.container = container;
            this.map = new Bitmap(width, height);
            this.g = Graphics.FromImage(this.map);
            this.multicolors = getGradients(Color.Green, Color.Red, 12);
        }
        private IEnumerable<Color> getGradients(Color start, Color end, int steps)
        {
            float stepA = ((end.A - start.A) / (steps - 1));
            float stepR = ((end.R - start.R) / (steps - 1));
            float stepG = ((end.G - start.G) / (steps - 1));
            float stepB = ((end.B - start.B) / (steps - 1));
            for (int i = 0; i < steps; i++)
            {
                yield return Color.FromArgb((byte)(start.A + (stepA * i)),
                                            (byte)(start.R + (stepR * i)),
                                            (byte)(start.G + (stepG * i)),
                                            (byte)(start.B + (stepB * i)));
            }
        }

        private Pen pathpen = new Pen(Color.BlueViolet, 4);
        private Pen startpen = new Pen(Color.Red, 2);
        private Pen finishpen = new Pen(Color.Blue, 2);
        private Pen isochornespen = new Pen(Color.Green, 3);
        private Pen trafficpen = new Pen(Color.Green, 3);
        private SolidBrush multibrush = new SolidBrush(Color.Transparent);
        private IEnumerable<Color> multicolors;
        private Coord upperleft;
        private double tilesize;
        /// <summary>
        /// draws GeometryContainer
        /// </summary>
        /// <param name="upperleft">upperleft of Bitmap, real-world coordinates (web-mercator, x from Greenwich / y from equator)</param>
        /// <param name="zoom">zoom level (for tile-map)</param>
        /// <returns>drawn Bitmap</returns>
        public Bitmap createMap(Coord upperleft, int zoom)
        {
            g.Clear(Color.Transparent);
            this.tilesize = 40075016.69 / Math.Pow(2, zoom);
            this.upperleft = upperleft;
            if (container.path != null)
            {
                foreach (ICoordArray line in container.path.getGeometry())
                {
                    System.Drawing.Point[] points = new System.Drawing.Point[line.length];
                    for (int j = 0; j < line.length; j++)
                    {
                        points[j] = realToScreen(line[j]);
                    }
                    g.DrawLines(pathpen, points);
                }
            }
            //if (container.polygon != null)
            //{
            //    System.Drawing.Point curr = realToScreen(container.polygon.points.Last());
            //    System.Drawing.Point next;
            //    for (int j = 0; j < container.polygon.points.Length; j++)
            //    {
            //        next = realToScreen(container.polygon.points[j]);
            //        g.DrawLine(isochornespen, curr, next);
            //        curr = next;
            //    }
            //}
            if (container.valuepoints != null)
            {
                System.Drawing.Point curr;
                for (int j = 0; j < container.valuepoints.points.Length; j++)
                {
                    curr = realToScreen(container.valuepoints.points[j].point);
                    int index = (int)(container.valuepoints.points[j].value / 300);
                    if (index > 11)
                    {
                        index = 11;
                    }
                    multibrush.Color = this.multicolors.ElementAt(index);
                    g.FillEllipse(multibrush, curr.X, curr.Y, 5, 5);
                }
            }
            //if (container.mgimg != null)
            //{
            //    System.Drawing.Point ul = realToScreen(container.mgimg.upperleft);
            //    double width = container.mgimg.width * 256 / tilesize;
            //    double height = container.mgimg.height * 256 / tilesize;
            //    g.DrawImage(container.mgimg.image, ul.X, ul.Y, (int)width, (int)height);
            //}
            if (container.traffic != null)
            {
                for (int i = 0; i < container.traffic.edgetraffic.Length; i++)
                {
                    int t = container.traffic.edgetraffic[i];
                    if (t > 0)
                    {
                        ICoordArray line = container.geom.getEdge(i);
                        System.Drawing.Point[] points = new System.Drawing.Point[line.length];
                        for (int j = 0; j < line.length; j++)
                        {
                            points[j] = realToScreen(line[j]);
                        }
                        if (t > 11)
                        {
                            t = 11;
                        }
                        trafficpen.Color = this.multicolors.ElementAt(t);
                        g.DrawLines(trafficpen, points);
                    }
                }
            }
            System.Drawing.Point startpoint = realToScreen(container.startnode);
            g.DrawEllipse(startpen, new Rectangle(startpoint.X - 5, startpoint.Y - 5, 10, 10));
            System.Drawing.Point endpoint = realToScreen(container.endnode);
            g.DrawEllipse(finishpen, new Rectangle(endpoint.X - 5, endpoint.Y - 5, 10, 10));
            return this.map;
        }

        private System.Drawing.Point realToScreen(Coord point)
        {
            double x = (point[0] - upperleft[0]) * 256 / tilesize;
            double y = -(point[1] - upperleft[1]) * 256 / tilesize;
            return new System.Drawing.Point((int)x, (int)y);
        }
    }
}
