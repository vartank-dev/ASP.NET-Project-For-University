using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Driver;
using CinemaProject.Services;
using CinemaProject.Models;
using CinemaProject.DTOs;
using System.Security.Claims;

namespace CinemaProject.Controllers;

[ApiController]
[Route("api/movies")]
public class MoviesController : ControllerBase
{
    private readonly MongoDbService _db;

    public MoviesController(MongoDbService db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var movies = await _db.Movies.Find(_ => true).ToListAsync();
        return Ok(movies);
    }

    // ✅ FIX: route constraint
    [HttpGet("{id:length(24)}")]
    public async Task<IActionResult> GetById(string id)
    {
        var movie = await _db.Movies.Find(m => m.Id == id).FirstOrDefaultAsync();
        if (movie == null) return NotFound();
        return Ok(movie);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] MovieCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var movie = new Movie
        {
            Title = dto.Title,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            CategoryId = dto.CategoryId,
            OwnerId = userId
        };

        await _db.Movies.InsertOneAsync(movie);
        return Ok(movie);
    }

    // 👇 вече НЕ конфликтва
    [Authorize]
    [HttpPost("view/{movieId:length(24)}")]
    public async Task<IActionResult> View(string movieId)
    {
        var filter = Builders<Watchlist>.Filter
            .Where(w => w.MovieId == movieId);

        var update = Builders<Watchlist>.Update
            .Inc(w => w.Views, 1);

        await _db.Watchlists.UpdateOneAsync(
            filter,
            update,
            new UpdateOptions { IsUpsert = true }
        );

        return Ok();
    }

    [HttpGet("view/{movieId:length(24)}")]
    public async Task<IActionResult> GetViews(string movieId)
    {
        var watch = await _db.Watchlists
            .Find(w => w.MovieId == movieId)
            .FirstOrDefaultAsync();

        return Ok(watch?.Views ?? 0);
    }

    [Authorize]
    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var movie = await _db.Movies.Find(m => m.Id == id).FirstOrDefaultAsync();

        if (movie == null) return NotFound();
        if (movie.OwnerId != userId) return Forbid();

        await _db.Movies.DeleteOneAsync(m => m.Id == id);
        return Ok();
    }

    [Authorize]
    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, MovieCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var movie = await _db.Movies.Find(m => m.Id == id).FirstOrDefaultAsync();

        if (movie.OwnerId != userId) return Forbid();

        var update = Builders<Movie>.Update
            .Set(m => m.Title, dto.Title)
            .Set(m => m.Description, dto.Description)
            .Set(m => m.ImageUrl, dto.ImageUrl)
            .Set(m => m.CategoryId, dto.CategoryId);

        await _db.Movies.UpdateOneAsync(m => m.Id == id, update);
        return Ok();
    }

    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> ByCategory(string categoryId)
    {
        var movies = await _db.Movies
            .Find(m => m.CategoryId == categoryId)
            .ToListAsync();

        return Ok(movies);
    }

}
