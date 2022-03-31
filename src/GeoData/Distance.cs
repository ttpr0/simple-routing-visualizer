using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    static class Distance
    {
        public static double haversineDistance(Point from, Point to)
        {
            double r = 6365000;
            double lat1 = from[1] * Math.PI / 180;
            double lat2 = to[1] * Math.PI / 180;
            double lon1 = from[0] * Math.PI / 180;
            double lon2 = to[0] * Math.PI / 180;
            double a = Math.Pow(Math.Sin((lat2 - lat1) / 2), 2);
            double b = Math.Pow(Math.Sin((lon2 - lon1) / 2), 2);
            return 2 * r * Math.Asin(Math.Sqrt(a + Math.Cos(lat1) * Math.Cos(lat2) * b));
        }

        public static double euclideanDistance(Point a, Point b)
        {
            return Math.Sqrt(Math.Pow(a[0] - b[0], 2) + Math.Pow(a[1] - b[1], 2));
        }
    }
}
