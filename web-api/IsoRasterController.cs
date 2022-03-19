using System.Runtime.InteropServices;
using Simple.GeoData;
using Simple.Routing.Graph;
using System;
using Simple.Routing.IsoRaster;
using Microsoft.AspNetCore.Http;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Simple.WebApi
{
    static class IsoRasterController
    {
        static int getClosestNode(PointD startpoint)
        {
            double distance = -1;
            int id = 0;
            double newdistance;
            IGeometry geom = Application.graph.getGeometry();
            for (int i = 0; i < geom.getAllNodes().Length; i++)
            {
                PointD point = geom.getNode(i);
                newdistance = Math.Sqrt(Math.Pow(startpoint.lon - point.lon, 2) + Math.Pow(startpoint.lat - point.lat, 2));
                if (distance == -1)
                {
                    distance = newdistance;
                    id = i;
                }
                if (newdistance < distance)
                {
                    distance = newdistance;
                    id = i;
                }
            }
            return id;
        }

        static PolygonD[] runIsoRaster(PointD start, int distance, int precession)
        {
            ShortestPathTree mg = new ShortestPathTree(Application.graph, getClosestNode(start), distance, new DefaultRasterizer(precession));

            mg.calcMultiGraph();

            return mg.getIsoRaster();
        }

        public static IsoRasterResponse handleMultiGraphRequest(IsoRasterRequest request)
        {
            PointD start = new PointD(request.locations[0][0], request.locations[0][1]);
            PolygonD[] pc = runIsoRaster(start, request.range, request.precession);
            IsoRasterResponse response = new IsoRasterResponse(pc);
            return response;
        }
    }

    class IsoRasterRequest
    {
        public double[][] locations { get; set; }
        public int range { get; set; }
        public int precession { get; set; }
    }

    class IsoRasterResponse
    {
        public string type { get; set; }
        public PolygonD[] features { get; set;}

        public IsoRasterResponse(PolygonD[] pc)
        {
            this.type = "FeatureCollection";
            this.features = pc;
        }

        public object getGeoJson()
        {
            var geojson = new
            {
                type = "FeatureCollection",
                features = from polygon in this.features select new
                           {
                               type = "Feature",
                               properties = new { value = polygon.value },
                               geometry = new
                               {
                                   type = "Polygon",
                                   coordinates = new[] { from point in polygon.points select new[] { point.lon, point.lat } }
                               }
                           }
            };
            return geojson;
        }
    }

    class PointFeature
    {
        public string type { get; set; }
        public PointGeometry geometry { get; set; }
        public PointProperties properties { get; set; }

        public PointFeature(PointD geom, int value)
        {
            this.type = "Feature";
            this.properties = new PointProperties(value);
            this.geometry = new PointGeometry(geom);
        }
    }

    class PointProperties
    {
        public int value { get; set; }

        public PointProperties(int value)
        {
            this.value = value;
        }
    }

    class PointGeometry
    {
        public string type { get; set; }
        public List<double> coordinates { get; set; }

        public PointGeometry(PointD coord)
        {
            this.type = "Point";
            this.coordinates = new List<double>();
            this.coordinates.Add(coord.lon);
            this.coordinates.Add(coord.lat);
        }
    }
}
