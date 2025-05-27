
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using NLog;
using NLog.Web;

namespace GateWay
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var logger = LogManager.Setup()
                       .LoadConfigurationFromFile("NLog.config")
                       .GetCurrentClassLogger();
            try
            {
                logger.Info("Starting..........");
                logger.Debug("Init main");
                var builder = WebApplication.CreateBuilder(args);
                builder.Logging.SetMinimumLevel(Microsoft.Extensions.Logging.LogLevel.Information);
                builder.Logging.ClearProviders();
                builder.Host.UseNLog();
              //  Add services to the container.
               builder.Services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
               .AddJwtBearer(options =>
               {
                   options.TokenValidationParameters = new TokenValidationParameters
                   {
                       ValidateIssuer = true,
                       ValidateAudience = true,
                       ValidateLifetime = true,
                       ValidateIssuerSigningKey = true,
                       ClockSkew = TimeSpan.Zero,
                       ValidIssuer = builder.Configuration["Auth:Issuer"],
                       ValidAudience = builder.Configuration["Auth:Audience"],
                       IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Auth:Key"]))
                   };
                   options.Events = new JwtBearerEvents
                   {
                       OnAuthenticationFailed = context =>
                       {
                           if (context.Exception is SecurityTokenExpiredException)
                           {
                               context.Response.StatusCode = 401;
                               context.Response.ContentType = "application/json";
                               return context.Response.WriteAsync("{\"error\": \"Token has expired\"}");
                           }
                           return Task.CompletedTask;
                       }
                   };
               });

                builder.Services.AddControllers();
                // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
                builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen();
                builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);
                builder.Services.AddOcelot(builder.Configuration);  
                var app = builder.Build();

                // Configure the HTTP request pipeline.
                if (app.Environment.IsDevelopment())
                {
                    app.UseSwagger();
                    app.UseSwaggerUI();
                }
                app.UseHttpsRedirection();
                await app.UseOcelot();

                app.UseAuthorization();
                app.UseAuthentication();
                app.MapControllers();
                app.Run();
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Stopped program because of exception");
                throw;
            }
            finally
            {
                NLog.LogManager.Shutdown();
            }

        }
    }
}
