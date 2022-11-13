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
    [Route("/v0/[controller]")]
    [ApiController]
    public class RoutingController
    {
        IShortestPath alg = null;
        bool draw;

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
            if (alg == null)
            {
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
                List<ICoordArray> lines = new List<ICoordArray>();
                bool finished = !alg.steps(request.stepcount, lines);
                if (finished)
                {
                    lines = alg.getShortestPath().getGeometry();
                }
                response = new RoutingResponse(lines, finished, request.key);
            }
            return response.getGeoJson();
        }
    }
}
