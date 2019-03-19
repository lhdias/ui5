﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace UI5
{
    public class Startup
    {
        
        public void ConfigureServices(IServiceCollection services)
        {
        }

  
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

     
            app.UseDefaultFiles(new DefaultFilesOptions
            {
                DefaultFileNames = new string[] { "Index.html" },
            });

            app.UseStaticFiles();

            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("Ui5");
            });
        }
    }
}