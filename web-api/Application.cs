using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using Simple.Routing.Graph;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Windows.Forms;

namespace Simple.WebApi
{
    static class Application
    {
        public static IGraph graph = GraphFactory.loadBaseGraph("data/default.graph");

        public static void Start(string[] args)
        { 
            var builder = WebApplication.CreateBuilder(new WebApplicationOptions
            {
                Args = args,
                // Look for static files in webroot
                WebRootPath = "web-app"
            });
            var app = builder.Build();

            //add static file provider
            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".geojson"] = "application/json";
            app.UseStaticFiles(new StaticFileOptions
            {
                ContentTypeProvider = provider
            });


            //add request-handlers
            app.MapGet("/close", () => { app.StopAsync().Wait(); });

            app.MapPost("/v0/shortestpathtree/driving-car", ( [FromBody] IsoRasterRequest request) =>
            {
                return IsoRasterController.handleMultiGraphRequest(request).getGeoJson();
            });

            app.MapPost("/v0/routing/driving-car", ([FromBody] RoutingRequest request) =>
            {
                if (request.key == -1)
                {
                    request.key = RoutingControllerDict.getKey();
                }
                RoutingController controller = RoutingControllerDict.getRoutingController(request.key);
                RoutingResponse response = controller.handleRoutingRequest(request);
                if (response.finished)
                {
                    RoutingControllerDict.removeRoutingController(response.key);
                }
                return response.getGeoJson();
            });


            var uri = "http://localhost:5000/index.html";
            var psi = new System.Diagnostics.ProcessStartInfo();
            psi.UseShellExecute = true;
            psi.FileName = uri;
            System.Diagnostics.Process.Start(psi);

            app.Run("http://localhost:5000");
        }
    }
}
