using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple.GeoData
{
    static class Distance
    {
        public static double haversineDistance(PointD a, PointD b)
        {
            return 0;
        }

        public static double euclideanDistance(PointD a, PointD b)
        {
            return Math.Sqrt(Math.Pow(a.lon - b.lon, 2) + Math.Pow(a.lat - b.lat, 2));
        }
    }
}
