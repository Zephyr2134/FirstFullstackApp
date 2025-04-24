using Microsoft.AspNetCore.SignalR;
using Microsoft.Net.Http.Headers;

namespace CrudApp.Models;

public class Pokemon
{
    public int Id {get; set;}
    public required string Name {get; set;}
    public required string Type {get; set;}
    public required string imgUrl {get;set;}
}