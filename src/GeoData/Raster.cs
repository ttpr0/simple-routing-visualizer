using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace Simple.GeoData
{
    class Raster
    {
        public PointD upperleft;
        public int cellsize;
        public int rows;
        public int cols;
        public int[,] values;

        public Raster(PointD upperleft, int rows, int columns, int cellsize)
        {
            this.upperleft = upperleft;
            this.values = new int[columns,rows];
            for (int x = 0; x < columns; x++)
            {
                for (int y = 0; y < rows; y++)
                {
                    values[x, y] = -1;
                }
            }
            this.cellsize = cellsize;
            this.rows = rows;
            this.cols = columns;
        }

        public void valuesFromPointCloud(PointCloudD cloud)
        {
            for (int i = 0; i < cloud.points.Count(); i++)
            {
                int x = (int)((cloud.points[i].point.lon - upperleft.lon) / cellsize);
                int y = (int)((cloud.points[i].point.lat - upperleft.lat + rows * cellsize) / cellsize);
                if (x < 0 || x >= cols || y < 0 || y >= rows)
                {
                    continue;
                }
                values[x, y] = cloud.points[i].value;
            }
        }

        public int getHeight()
        {
            return this.rows * this.cellsize;
        }

        public int getWidth()
        {
            return this.cols * this.cellsize;
        }
    }
}
