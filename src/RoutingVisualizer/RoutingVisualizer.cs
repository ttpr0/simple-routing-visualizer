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

namespace RoutingVisualizer
{
    static class RoutingVisualizer
    {
        public static void Start(string[] args)
        {
            var builder = WebApplication.CreateBuilder(new WebApplicationOptions
            {
                Args = args,
                // Look for static files in webroot
                WebRootPath = "web-app"
            });

            builder.Services.AddSingleton<IGraph>(GraphFactory.loadBaseGraph("data/default.graph"));

            builder.Services.AddControllers();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  builder =>
                                  {
                                      builder.WithOrigins("http://localhost:3000");
                                  });
            });

            var app = builder.Build();

            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseCors(MyAllowSpecificOrigins);

            //add static file provider
            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".geojson"] = "application/json";
            app.UseStaticFiles(new StaticFileOptions
            {
                ContentTypeProvider = provider
            });

            //add request-handlers
            app.MapGet("/close", () => { app.StopAsync().Wait(); });


            //var uri = "http://localhost:5000/index.html";
            //var psi = new System.Diagnostics.ProcessStartInfo();
            //psi.UseShellExecute = true;
            //psi.FileName = uri;
            //System.Diagnostics.Process.Start(psi);

            app.MapControllers();

            app.Run("http://localhost:5000");
        }
    }
}
