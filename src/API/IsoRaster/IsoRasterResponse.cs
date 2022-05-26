using System.Runtime.InteropServices;
using Simple.GeoData;
using Simple.Routing.Graph;
using System;
using Simple.Routing.ShortestPathTree;
using Microsoft.AspNetCore.Http;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace RoutingVisualizer.API.IsoRaster
{
    public class IsoRasterResponse
    {
        public string type { get; set; }
        public GeoJsonPolygon[] features { get; set; }

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
