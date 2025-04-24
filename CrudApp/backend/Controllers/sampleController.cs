using Microsoft.AspNetCore.Mvc;
using CrudApp.Models;
using Microsoft.EntityFrameworkCore;

namespace CrudApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SampleController : ControllerBase{

    private readonly AppDbContext _context;

    public SampleController(AppDbContext context){
        _context = context;
    }

    [HttpGet("/all")]
    public async Task<ActionResult<IEnumerable<Pokemon>>> GetAll()
    {
        var pokemons = await _context.Pokemons.ToListAsync();
        return Ok(pokemons);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Pokemon>> GetSingular(int id){
        var pokemon = await _context.Pokemons.FindAsync(id);
        if(pokemon == null){
            return NotFound();
        }
        return Ok(pokemon);
    }

    [HttpPost]
    public async Task<ActionResult<IEnumerable<Pokemon>>> PostPokemon([FromBody]Pokemon pokemon){
        if(pokemon == null){
            return BadRequest("Pokemon is null");
        }
        
        _context.Pokemons.Add(pokemon);
        await _context.SaveChangesAsync();

        return Ok(CreatedAtAction(nameof(GetSingular), new { Name = pokemon.Name,Type=pokemon.Type, imgUrl=pokemon.imgUrl}, pokemon));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePokemon(int id){
        var pokemon = await _context.Pokemons.FindAsync(id);
        if(pokemon == null){
            return NotFound();
        }

        _context.Pokemons.Remove(pokemon);

        await _context.SaveChangesAsync();

        return Ok(NoContent());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePokemon(int id, [FromBody]Pokemon pokemon)
    {
        var isThere = await _context.Pokemons.FindAsync(id);
        if(isThere == null){
            return NotFound();
        }
        if (isThere.Name != pokemon.Name)isThere.Name = pokemon.Name;
        if (isThere.Type != pokemon.Type)isThere.Type = pokemon.Type;
        if (isThere.imgUrl != pokemon.imgUrl)isThere.imgUrl = pokemon.imgUrl;

        await _context.SaveChangesAsync();

        return Ok(NoContent());
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(IFormFile image){
        if(image == null || image.Length == 0){
            return BadRequest("No image uploaded");
        }

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
        if(!Directory.Exists(uploadsFolder)){
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var fileStream = new FileStream(filePath,FileMode.Create)){
            await image.CopyToAsync(fileStream);
        }

        var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{uniqueFileName}";

        return Ok(new {imageUrl});
    }
}