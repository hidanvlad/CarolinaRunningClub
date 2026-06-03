using Microsoft.EntityFrameworkCore;
using CarolinaRunningClub.Backend.Data;
using CarolinaRunningClub.Backend.Models;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Mandatory: Link the connection string to the ORM for data persistency
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- GOLD CHALLENGE MECHANISM: Register local cache memory infrastructure service ---
builder.Services.AddMemoryCache(); // Injects resource optimizations to defeat JMeter stress bursts

// --- BRONZE & SILVER: Configure Cryptographic Token Authentication Engine ---
var secretKey = "CarolinaRunningClubSuperSecretSecureKey123!";
var key = Encoding.ASCII.GetBytes(secretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true; // Enabled strict HTTPS metadata check for production security
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true, // Cryptographically manages token expiration and sessions
        ClockSkew = TimeSpan.Zero
    };
});

// Services for implementing CRUD operations and solving the Gold Challenge infrastructure
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // This ensures the API doesn't crash if it hits a loop (critical for User-Role relationships)
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddOpenApi();

// Configure CORS to allow the React frontend to communicate with the server 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
         policy => policy.AllowAnyOrigin() // This allows any device on your network to connect
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// Enable OpenAPI/Swagger in development
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// --- GOLD DATA SEEDER MIDDLEWARE ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        CarolinaRunningClub.Backend.Data.DbSeeder.SeedData(context); // Run the database faker populator 
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[SEEDER ERROR] Failed to seed database: {ex.Message}");
    }
}

// Order is critical here for fullstack security behavior
app.UseHttpsRedirection(); // Enforces automatic TLS/HTTPS upgrade on network sockets
app.UseCors("AllowAll");

app.UseAuthentication(); // Read and validate JWT signatures before running any request code
app.UseAuthorization();  // Assess role permissions based on verified token contents

app.UseStaticFiles(); // Tells .NET to serve files from the wwwroot folder
app.MapControllers();

app.Run();