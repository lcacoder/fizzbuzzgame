using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using System.Security.Cryptography.X509Certificates;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);
var certificatePath = "/app/localhost.pfx";
var certificatePassword = "yourpassword";
var certificate = new X509Certificate2(certificatePath, certificatePassword);

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // Configure Kestrel to listen on 5020 with HTTPS
    serverOptions.Listen(System.Net.IPAddress.Any, 5020, listenOptions =>
    {
        listenOptions.UseHttps(certificate);
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Frontend origin
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddSwaggerGen();
builder.Services.AddScoped<GameService>();
builder.Services.AddScoped<GameRuleService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigin");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
