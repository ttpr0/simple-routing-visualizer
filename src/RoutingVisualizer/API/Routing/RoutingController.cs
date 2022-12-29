using Simple.GeoData;
using Simple.Routing.Graph;
using System;
using Simple.Routing.ShortestPath;
using Microsoft.AspNetCore.Http;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;


namespace RoutingVisualizer.API.Routing
{
    [Route("/v0/routing")]
    [ApiController]
    public class RoutingController
    {
        ILogger<RoutingController> logger;
        IGraph graph;

        public RoutingController(ILogger<RoutingController> logger, IGraph graph)
        {
            this.logger = logger;
            this.graph = graph;
        }

        int getClosestNode(Coord startpoint)
        {
            double distance = -1;
            int id = 0;
            double newdistance;
            IGeometry geom = graph.getGeometry();
            for (int i = 0; i < geom.getAllNodes().Length; i++)
            {
                Coord point = geom.getNode(i);
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

        [HttpPost]
        public object handleRoutingRequest([FromBody] RoutingRequest request)
        {
            IShortestPath alg;
            Coord start = new Coord(request.start[0], request.start[1]);
            Coord end = new Coord(request.end[0], request.end[1]);
            switch (request.algorithm)
            {
                case "Dijkstra":
                    alg = new Dijkstra(graph, getClosestNode(start), getClosestNode(end));
                    break;
                case "A*":
                    alg = new AStar(graph, getClosestNode(start), getClosestNode(end));
                    break;
                case "Bidirect-Dijkstra":
                    alg = new BidirectDijkstra(graph, getClosestNode(start), getClosestNode(end));
                    break;
                case "Bidirect-A*":
                    alg = new BidirectAStar(graph, getClosestNode(start), getClosestNode(end));
                    break;
                default:
                    alg = new Dijkstra(graph, getClosestNode(start), getClosestNode(end));
                    break;
            }

            alg.calcShortestPath();
            RoutingResponse response = new RoutingResponse(alg.getShortestPath().getGeometry(), true, request.key);

            return response.getGeoJson();
        }
    }

    [Route("/v0/routing/draw")]
    [ApiController]
    public class RoutingDrawController
    {
        static Dictionary<int, IShortestPath> algs_dict = new Dictionary<int, IShortestPath>();

        ILogger<RoutingController> logger;
        IGraph graph;

        public RoutingDrawController(ILogger<RoutingController> logger, IGraph graph)
        {
            this.logger = logger;
            this.graph = graph;
        }

        int getClosestNode(Coord startpoint)
        {
            double distance = -1;
            int id = 0;
            double newdistance;
            IGeometry geom = graph.getGeometry();
            for (int i = 0; i < geom.getAllNodes().Length; i++)
            {
                Coord point = geom.getNode(i);
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

        [Route("create")]
        [HttpPost]
        public object handleCreateContextRequest([FromBody] DrawContextRequest request) 
        {
            IShortestPath alg;
            Coord start = new Coord(request.start[0], request.start[1]);
            Coord end = new Coord(request.end[0], request.end[1]);
            switch (request.algorithm)
            {
                case "Dijkstra":
                    alg = new Dijkstra(graph, getClosestNode(start), getClosestNode(end));
                    break;
                case "A*":
                    alg = new AStar(graph, getClosestNode(start), getClosestNode(end));
                    break;
                case "Bidirect-Dijkstra":
                    alg = new BidirectDijkstra(graph, getClosestNode(start), getClosestNode(end));
                    break;
                case "Bidirect-A*":
                    alg = new BidirectAStar(graph, getClosestNode(start), getClosestNode(end));
                    break;
                default:
                    alg = new Dijkstra(graph, getClosestNode(start), getClosestNode(end));
                    break;
            }
            int key = -1;
            var rand = new Random();
            while (true) {
                int k = rand.Next(0, 1000);
                if (!algs_dict.ContainsKey(k)) {
                    algs_dict[k] = alg;
                    key = k;
                    break;
                }
            }
            return new DrawContextResponse(key);
        }

        [Route("step")]
        [HttpPost]
        public object handleRoutingStepRequest([FromBody] DrawRoutingRequest request)
        {
            IShortestPath alg;
            if (request.key != -1 && algs_dict.ContainsKey(request.key)) {
                alg = algs_dict[request.key];
            }
            else {
                throw new Exception("invalid context");
            }

            var edges = new List<ICoordArray>();
            bool finished = !alg.steps(request.stepcount, edges);
            RoutingResponse response;
            if (finished) {
                response = new RoutingResponse(alg.getShortestPath().getGeometry(), true, request.key);   
            }
            else {
                response = new RoutingResponse(edges, finished, request.key);
            }
            return response.getGeoJson();
        }
    }
}
