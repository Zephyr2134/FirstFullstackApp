using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.IO;

var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(),"wwwroot","uploads");
if(!Directory.Exists(uploadsFolder)){
    Directory.CreateDirectory(uploadsFolder);
}

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseSqlite("Data Source=app.db"));

var app = builder.Build();

app.MapControllers();
app.UseCors();
app.UseStaticFiles(new StaticFileOptions{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads")),
    RequestPath = "/uploads"
});

app.Run();