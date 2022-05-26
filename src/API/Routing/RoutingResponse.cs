using Simple.GeoData;
using Simple.Routing.Graph;
using System;
using Simple.Routing.ShortestPath;
using Microsoft.AspNetCore.Http;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace RoutingVisualizer.API.Routing
{
    public class RoutingResponse
    {
        public string type { get; set; }
        public bool finished { get; set; }
        public List<GeoJsonLineString> features { get; set; }
        public int key { get; set; }

        public RoutingResponse(List<ICoordArray> lines, bool finished, int key)
        {
            this.type = "FeatureCollection";
            this.finished = finished;
            this.key = key;
            this.features = new List<GeoJsonLineString>();
            foreach (CoordArray line in lines)
            {
                this.features.Add(new GeoJsonLineString(line, 0));
            }
        }

        public object getGeoJson()
        {
            //var geojson = new 
            //{
            //    type = "FeatureCollection",
            //    finished = this.finished,
            //    key = this.key,
            //    features = from line in this.features select new 
            //    {
            //            type = "Feature",
            //            properties = new { value = 1 },
            //            geometry = new
            //            {
            //                type = "LineString",
            //                coordinates = from point in line.points select new[] { point.lon, point.lat }
            //            }
            //    }
            //};
            //return geojson;
            return this;
        }
    }
}
