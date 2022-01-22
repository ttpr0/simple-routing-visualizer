using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace Simple.GeoData
{
    class RasterImage
    {
        public Bitmap image;
        public int height;
        public int width;
        public PointD upperleft;

        public RasterImage(Raster raster, ColorFactory colorfactory)
        {
            this.height = raster.getHeight();
            this.width = raster.getWidth();
            this.upperleft = raster.upperleft;
            this.image = new Bitmap(raster.cols, raster.rows);
            for (int x = 0; x < raster.cols; x++)
            {
                for (int y = 0; y < raster.rows; y++)
                {
                    this.image.SetPixel(x, (raster.rows-1-y), colorfactory.getColor(raster.values[x, y]));
                }
            }
        }
    }
}
