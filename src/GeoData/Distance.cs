using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    static class Distance
    {
        public static double haversineDistance(PointD from, PointD to)
        {
            double r = 6365000;
            double lat1 = from.lat * Math.PI / 180;
            double lat2 = to.lat * Math.PI / 180;
            double lon1 = from.lon * Math.PI / 180;
            double lon2 = to.lon * Math.PI / 180;
            double a = Math.Pow(Math.Sin((lat2 - lat1) / 2), 2);
            double b = Math.Pow(Math.Sin((lon2 - lon1) / 2), 2);
            return 2 * r * Math.Asin(Math.Sqrt(a + Math.Cos(lat1) * Math.Cos(lat2) * b));
        }

        public static double euclideanDistance(PointD a, PointD b)
        {
            return Math.Sqrt(Math.Pow(a.lon - b.lon, 2) + Math.Pow(a.lat - b.lat, 2));
        }
    }
}
