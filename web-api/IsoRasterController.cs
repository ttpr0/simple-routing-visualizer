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
        static int getClosestNode(Coord startpoint)
        {
            double distance = -1;
            int id = 0;
            double newdistance;
            IGeometry geom = Application.graph.getGeometry();
            for (int i = 0; i < geom.getAllNodes().Length; i++)
            {
                ICoord point = geom.getNode(i);
                newdistance = Math.Sqrt(Math.Pow(startpoint[0] - point[0], 2) + Math.Pow(startpoint[1] - point[1], 2));
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

        static GeoJsonPolygon[] runIsoRaster(Coord start, int distance, int precession)
        {
            ShortestPathTree mg = new ShortestPathTree(Application.graph, getClosestNode(start), distance, new DefaultRasterizer(precession));

            mg.calcMultiGraph();

            return mg.getIsoRaster();
        }

        public static IsoRasterResponse handleMultiGraphRequest(IsoRasterRequest request)
        {
            Coord start = new Coord(request.locations[0][0], request.locations[0][1]);
            GeoJsonPolygon[] pc = runIsoRaster(start, request.range, request.precession);
            IsoRasterResponse response = new IsoRasterResponse(pc);
            return response;
        }
    }

    class IsoRasterRequest
    {
        public float[][] locations { get; set; }
        public int range { get; set; }
        public int precession { get; set; }
    }

    class IsoRasterResponse
    {
        public string type { get; set; }
        public GeoJsonPolygon[] features { get; set;}

        public IsoRasterResponse(GeoJsonPolygon[] polygons)
        {
            this.type = "FeatureCollection";
            this.features = polygons;
        }

        public object getGeoJson()
        {
            //var geojson = new
            //{
            //    type = "FeatureCollection",
            //    features = from polygon in this.features select new
            //               {
            //                   type = "Feature",
            //                   properties = new { value = polygon.value },
            //                   geometry = new
            //                   {
            //                       type = "Polygon",
            //                       coordinates = new[] { from point in polygon.points select new[] { point.lon, point.lat } }
            //                   }
            //               }
            //};
            //return geojson;
            return this;
        }
    }
}
