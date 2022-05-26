using System.Runtime.InteropServices;
using Simple.GeoData;
using Simple.Routing.Graph;
using System;
using Simple.Routing.ShortestPathTree;
using RoutingVisualizer.IsoRaster;
using Microsoft.AspNetCore.Http;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace RoutingVisualizer.API.IsoRaster
{
    [Route("/v0/[controller]")]
    [ApiController]
    public class IsoRasterController
    {
        ILogger<IsoRasterController> logger;

        IGraph graph;

        public IsoRasterController(ILogger<IsoRasterController> logger, IGraph graph)
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

        GeoJsonPolygon[] runIsoRaster(Coord start, int distance, int precession)
        {
            SPTConsumer consumer = new SPTConsumer(new DefaultRasterizer(precession));
            ShortestPathTree mg = new ShortestPathTree(graph, getClosestNode(start), distance, consumer);

            mg.calcMultiGraph();

            return consumer.getIsoRaster();
        }

        [HttpPost]
        public object handleMultiGraphRequest(IsoRasterRequest request)
        {
            if (!request.isvalid)
            {
                return null;
            }
            Coord start = new Coord(request.locations[0][0], request.locations[0][1]);
            GeoJsonPolygon[] pc = runIsoRaster(start, request.range, request.precession);
            IsoRasterResponse response = new IsoRasterResponse(pc);
            return response.getGeoJson();
        }
    }
}
