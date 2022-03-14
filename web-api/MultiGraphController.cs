using System.Runtime.InteropServices;
using Simple.GeoData;
using Simple.Routing.Graph;
using System;
using Simple.Routing.Isodistance;
using Microsoft.AspNetCore.Http;
using System.Collections;
using System.Collections.Generic;

namespace Simple.WebApi
{
    static class MultiGraphController
    {
        static PointD transformMercator(PointD point)
        {
            int a = 6378137;
            double x = a * point.lon * Math.PI / 180;
            double y = a * Math.Log(Math.Tan(Math.PI / 4 + point.lat * Math.PI / 360));
            return new PointD(x, y);
        }

        public static PointD revTransformMercator(PointD point)
        {
            int a = 6378137;
            double lon = point.lon * 180 / (a * Math.PI);
            double lat = 360 * (Math.Atan(Math.Exp(point.lat / a)) - Math.PI / 4) / Math.PI;
            return new PointD(lon, lat);
        }

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

        static PointCloudD runMultiGraph(PointD start, int distance, int precession)
        {
            MultiGraph mg = new MultiGraph(Application.graph, getClosestNode(start), distance, new DefaultRasterizer(precession));

            mg.calcMultiGraph();

            return mg.getMultiGraph();
        }

        public static MultiGraphResponse handleMultiGraphRequest(MultiGraphRequest request)
        {
            PointD start = transformMercator(new PointD(request.locations[0][0], request.locations[0][1]));
            PointCloudD pc = runMultiGraph(start, request.range, request.precession);
            MultiGraphResponse response = new MultiGraphResponse(pc);
            return response;
        }
    }

    class MultiGraphRequest
    {
        public double[][] locations { get; set; }
        public int range { get; set; }
        public int precession { get; set; }
    }

    class MultiGraphResponse
    {
        public string type { get; set; }
        public List<PointFeature> features { get; set;}

        public MultiGraphResponse(PointCloudD pc)
        {
            this.type = "FeatureCollection";
            this.features = new List<PointFeature>();
            foreach (ValuePointD point in pc.points)
            {
                features.Add(new PointFeature(MultiGraphController.revTransformMercator(point.point), point.value));
            }
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
