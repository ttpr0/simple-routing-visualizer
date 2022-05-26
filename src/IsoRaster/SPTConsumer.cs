using Simple.GeoData;
using Simple.Routing.ShortestPathTree;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RoutingVisualizer.IsoRaster
{
    public class SPTConsumer : IConsumer
    {
        private QuadTree points;
        private IRasterizer rasterizer;

        public SPTConsumer(IRasterizer rasterizer)
        {
            this.rasterizer = rasterizer;
            this.points = new QuadTree();
        }

        public void consumePoint(Coord point, int value)
        {
            (int x, int y) = rasterizer.pointToIndex(point);
            points.insert(x, y, value);
        }

        /// <summary>
        /// use only after path finsing finished
        /// </summary>
        /// <returns>list of LineD representing shortest path</returns>
        public PointCloudD getPointCloud()
        {
            List<QuadNode> nodes = this.points.toList();
            ValuePointD[] vpoints = new ValuePointD[nodes.Count];
            //for (int i = 0; i < nodes.Count; i++)
            //{
            //    vpoints[i] = new ValuePointD(this.rasterizer.indexToPoint(nodes[i].x, nodes[i].y), nodes[i].value);
            //}
            return new PointCloudD(vpoints);
        }

        public GeoJsonPolygon[] getIsoRaster()
        {
            List<QuadNode> nodes = this.points.toList();
            GeoJsonPolygon[] poly = new GeoJsonPolygon[nodes.Count];
            for (int i = 0; i < nodes.Count; i++)
            {
                Coord ul = this.rasterizer.indexToPoint(nodes[i].x, nodes[i].y);
                Coord lr = this.rasterizer.indexToPoint(nodes[i].x + 1, nodes[i].y + 1);
                ICoordArray line = new CoordArray(new Coord[5]);
                line[0][0] = ul[0];
                line[0][1] = ul[1];
                line[1][0] = lr[0];
                line[1][1] = ul[1];
                line[2][0] = lr[0];
                line[2][1] = lr[1];
                line[3][0] = ul[0];
                line[3][1] = lr[1];
                line[4][0] = ul[0];
                line[4][1] = ul[1];
                poly[i] = new GeoJsonPolygon(new ICoordArray[1] { line }, nodes[i].value);
            }
            return poly;
        }
    }
}
