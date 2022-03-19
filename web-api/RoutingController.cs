using Simple.GeoData;
using Simple.Routing.Graph;
using System;
using Simple.Routing.ShortestPath;
using Microsoft.AspNetCore.Http;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Simple.WebApi
{
    static class RoutingControllerDict
    {
        public static Dictionary<int, RoutingController> dict = new Dictionary<int, RoutingController>();

        public static int getKey()
        {
            return dict.Count;
        }

        public static RoutingController getRoutingController(int key)
        {
            bool hasvalue = dict.TryGetValue(key, out RoutingController routingController);
            if (hasvalue)
            {
                return routingController;
            }
            else
            {
                routingController = new RoutingController();
                dict.Add(key, routingController);
                return routingController;
            }
        }

        public static void removeRoutingController(int key)
        {
            dict.Remove(key);
        }
    }

    class RoutingController
    {
        int start;
        int end;
        IShortestPath? alg = null;
        bool draw;

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

        public RoutingResponse handleRoutingRequest(RoutingRequest request)
        {
            if (alg == null)
            {
                PointD start = new PointD(request.start[0], request.start[1]);
                PointD end = new PointD(request.end[0], request.end[1]);
                switch (request.algorithm)
                {
                    case "Dijkstra":
                        alg = new Dijkstra(Application.graph, getClosestNode(start), getClosestNode(end));
                        break;
                    case "A*":
                        alg = new AStar(Application.graph, getClosestNode(start), getClosestNode(end));
                        break;
                    case "Bidirect-Dijkstra":
                        alg = new BidirectDijkstra(Application.graph, getClosestNode(start), getClosestNode(end));
                        break;
                    case "Bidirect-A*":
                        alg = new BidirectAStar(Application.graph, getClosestNode(start), getClosestNode(end));
                        break;
                    default:
                        alg = new Dijkstra(Application.graph, getClosestNode(start), getClosestNode(end));
                        break;
                }
                this.draw = request.drawRouting;
            }
            RoutingResponse response;
            if (this.draw == false)
            {
                alg.calcShortestPath();
                response = new RoutingResponse(alg.getShortestPath().getGeometry(), true, request.key);
            }
            else
            {
                List<LineD> lines = new List<LineD>();
                bool finished = !alg.steps(request.stepcount, lines);
                if (finished)
                {
                    lines = alg.getShortestPath().getGeometry();
                }
                response = new RoutingResponse(lines, finished, request.key);
            }
            return response;
        }
    }

    class RoutingRequest
    {
        public double[] start { get; set; }
        public double[] end { get; set; }
        public int key { get; set; }
        public bool drawRouting { get; set; }
        public string algorithm { get; set; }
        public int stepcount { get; set; }
    }

    class RoutingResponse
    {
        public bool finished { get; set; }
        public List<LineD> features { get; set; }
        public int key { get; set; }

        public RoutingResponse(List<LineD> lines, bool finished, int key)
        {
            this.finished = finished;
            this.key = key;
            this.features = new List<LineD>();
            foreach (LineD line in lines)
            {
                PointD[] points = new PointD[line.points.Length];
                for (int i = 0; i < line.points.Length; i++)
                {
                    points[i] = line.points[i];
                }
                this.features.Add(new LineD(points));
            }
        }

        public object getGeoJson()
        {
            var geojson = new 
            {
                type = "FeatureCollection",
                finished = this.finished,
                key = this.key,
                features = from line in this.features select new 
                {
                        type = "Feature",
                        properties = new { value = 1 },
                        geometry = new
                        {
                            type = "LineString",
                            coordinates = from point in line.points select new[] { point.lon, point.lat }
                        }
                }
            };
            return geojson;
        }
    }
}
